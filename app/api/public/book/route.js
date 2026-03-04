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

        const customerRepo = new CustomersRepository(tenantId);
        let customer = await prisma.customer.findFirst({
            where: { phone: customerData.phone, tenantId }
        });

        if (!customer) {
            customer = await customerRepo.create(customerData);
        }

        const serviceRepo = new ServicesRepository(tenantId);
        const service = await serviceRepo.getById(serviceId);
        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const start = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
        const end = start.plus({ minutes: service.duration });

        const startWithBuffer = start.minus({ minutes: service.bufferBefore });
        const endWithBuffer = end.plus({ minutes: service.bufferAfter });

        const appRepo = new AppointmentsRepository(tenantId);
        const hasConflict = await appRepo.hasConflict(staffId, startWithBuffer.toJSDate(), endWithBuffer.toJSDate());

        if (hasConflict) {
            return NextResponse.json({ error: "Horario nao mais disponivel." }, { status: 409 });
        }

        const location = await prisma.location.findFirst({ where: { tenantId } });
        if (!location) {
            return NextResponse.json({ error: "Location not found" }, { status: 404 });
        }

        const appointment = await appRepo.create({
            startTime: start.toJSDate(),
            endTime: end.toJSDate(),
            staffId,
            customerId: customer.id,
            serviceId,
            locationId: location.id,
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
