import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { AppointmentsRepository } from "@/domains/appointments/appointments.repository";
import { ServicesRepository } from "@/domains/services/services.repository";
import { z } from "zod";
import { DateTime } from "luxon";

const appointmentSchema = z.object({
    staffId: z.string().min(1),
    customerId: z.string().min(1),
    serviceId: z.string().min(1),
    locationId: z.string().min(1),
    startTime: z.string().datetime(), // ISO string UTC
    notes: z.string().optional(),
});

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || DateTime.now().toISODate();
    const staffId = searchParams.get("staffId");

    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    const repo = new AppointmentsRepository(tenantId);
    const appointments = await repo.getByDay(date, staffId);

    return NextResponse.json(appointments);
}

export async function POST(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = appointmentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const { staffId, serviceId, startTime: startTimeStr, customerId, locationId, notes } = result.data;

        // 1. Buscar detalhes do serviço para calcular endTime e buffers
        const serviceRepo = new ServicesRepository(tenantId);
        const service = await serviceRepo.getById(serviceId);

        if (!service) {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Serviço não encontrado' } }, { status: 404 });
        }

        const start = DateTime.fromISO(startTimeStr);

        // O tempo ocupado real na agenda inclui os buffers
        const startWithBuffer = start.minus({ minutes: service.bufferBefore });
        const endWithBuffer = start.plus({ minutes: service.duration + service.bufferAfter });
        const realEnd = start.plus({ minutes: service.duration });

        const repo = new AppointmentsRepository(tenantId);

        // 2. Verificar conflitos considerando os buffers
        const hasConflict = await repo.hasConflict(staffId, startWithBuffer.toJSDate(), endWithBuffer.toJSDate());

        if (hasConflict) {
            return NextResponse.json({
                error: {
                    code: 'CONFLICT',
                    message: 'Conflito de horário detectado (considere os buffers de preparação).'
                }
            }, { status: 409 });
        }

        // 3. Criar agendamento
        const appointment = await repo.create({
            startTime: start.toJSDate(),
            endTime: realEnd.toJSDate(),
            staffId,
            customerId,
            serviceId,
            locationId,
            notes,
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
