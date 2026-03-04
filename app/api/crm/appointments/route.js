import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
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

export const GET = withTenant(async (request, { db }) => {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || DateTime.now().toISODate();
    const staffId = searchParams.get("staffId");

    const repo = new AppointmentsRepository(db.tenantId);
    const appointments = await repo.getByDay(date, staffId);

    return apiResponse(appointments);
});

export const POST = withTenant(async (request, { db }) => {
    try {
        const body = await request.json();
        const result = appointmentSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const { staffId, serviceId, startTime: startTimeStr, customerId, locationId, notes } = result.data;
        const tenantId = db.tenantId;

        const serviceRepo = new ServicesRepository(tenantId);
        const service = await serviceRepo.getById(serviceId);

        if (!service) {
            return apiError('NOT_FOUND', null, 'Serviço não encontrado');
        }

        const start = DateTime.fromISO(startTimeStr);
        const startWithBuffer = start.minus({ minutes: service.bufferBefore });
        const endWithBuffer = start.plus({ minutes: service.duration + service.bufferAfter });
        const realEnd = start.plus({ minutes: service.duration });

        const repo = new AppointmentsRepository(tenantId);
        const hasConflict = await repo.hasConflict(staffId, startWithBuffer.toJSDate(), endWithBuffer.toJSDate());

        if (hasConflict) {
            return apiError('CONFLICT', null, 'Conflito de horário detectado (considere os buffers de preparação).');
        }

        const appointment = await repo.create({
            startTime: start.toJSDate(),
            endTime: realEnd.toJSDate(),
            staffId,
            customerId,
            serviceId,
            locationId,
            notes,
        });

        return apiResponse(appointment, 201);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
