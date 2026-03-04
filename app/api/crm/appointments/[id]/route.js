import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { AppointmentsRepository } from "@/domains/appointments/appointments.repository";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(['SCHEDULED', 'CONFIRMED', 'DONE', 'CANCELED', 'NO_SHOW']),
});

export async function PATCH(request, { params }) {
    const { id } = await params;
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = statusSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const repo = new AppointmentsRepository(tenantId);
        await repo.updateStatus(id, result.data.status);

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
