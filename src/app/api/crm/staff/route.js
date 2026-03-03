import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { StaffRepository } from "@/domains/staff/staff.repository";
import { z } from "zod";

const staffSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    locationId: z.string().optional(),
});

export async function GET(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    const repo = new StaffRepository(tenantId);
    const staff = await repo.getAll();
    return NextResponse.json(staff);
}

export async function POST(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = staffSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const repo = new StaffRepository(tenantId);
        const member = await repo.create(result.data);
        return NextResponse.json(member, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
