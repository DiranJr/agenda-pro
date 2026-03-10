import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { AppointmentsRepository } from "@/domains/appointments/appointments.repository";
import { CustomersRepository } from "@/domains/customers/customers.repository";
import { ServicesRepository } from "@/domains/services/services.repository";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DateTime } from "luxon";

const publicBookingSchema = z.object({
    slug: z.string(),
    serviceId: z.string(),
    staffId: z.string(),
    date: z.string(),
    time: z.string(),
    customer: z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
    }),
});

export async function POST(request) {
    try {
        const body = await request.json();
        const result = publicBookingSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.format() }, { status: 400 });
        }

        const { slug, serviceId, staffId, date, time, customer: customerData } = result.data;
        const { tenant, timezone } = await getRequestContext({ slug });

        if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

        const tenantId = tenant.id;

        const service = await prisma.service.findFirst({
            where: { id: serviceId, tenantId, active: true }
        });
        if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

        const start = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
        const end = start.plus({ minutes: service.duration });

        const startWithBuffer = start.minus({ minutes: service.bufferBefore });
        const endWithBuffer = end.plus({ minutes: service.bufferAfter });

        const appointment = await prisma.$transaction(async (tx) => {
            // 1. Criar ou Buscar Cliente
            let customer = await tx.customer.findFirst({
                where: { phone: customerData.phone, tenantId }
            });

            if (!customer) {
                customer = await tx.customer.create({
                    data: {
                        name: customerData.name,
                        phone: customerData.phone,
                        tenantId
                    }
                });
            }

            // 2. Verificar Conflito novamente de forma atômica
            // Nota: SQLite não suporta FOR UPDATE, mas o nível de isolamento serializable ajuda.
            // Aqui fazemos a busca dentro da transação.
            const conflicts = await tx.appointment.findMany({
                where: {
                    tenantId,
                    staffId,
                    status: { not: 'CANCELED' },
                    startTime: { lt: endWithBuffer.toJSDate() },
                    endTime: { gt: startWithBuffer.toJSDate() },
                },
            });

            const blocks = await tx.block.findMany({
                where: {
                    tenantId,
                    staffId,
                    startTime: { lt: endWithBuffer.toJSDate() },
                    endTime: { gt: startWithBuffer.toJSDate() },
                }
            });

            if (conflicts.length > 0 || blocks.length > 0) {
                throw new Error("ConcurrencyConflict: Horario nao mais disponivel.");
            }

            const location = await tx.location.findFirst({ where: { tenantId } });
            if (!location) throw new Error("Location not found");

            // 3. Criar Agendamento
            return tx.appointment.create({
                data: {
                    startTime: start.toJSDate(),
                    endTime: end.toJSDate(),
                    staffId,
                    customerId: customer.id,
                    serviceId,
                    locationId: location.id,
                    tenantId
                }
            });
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (err) {
        if (err.message.includes("ConcurrencyConflict")) {
            return NextResponse.json({ error: "Este horário acabou de ser reservado por outra pessoa. Por favor, escolha outro." }, { status: 409 });
        }
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
