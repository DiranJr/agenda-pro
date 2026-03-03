import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { CustomersRepository } from "@/domains/customers/customers.repository";
import { z } from "zod";

const customerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    noShows: z.number().int().nonnegative().default(0),
    tags: z.array(z.string()).default([]),
});

export async function GET(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    const repo = new CustomersRepository(tenantId);
    const customers = await repo.getAll();
    return NextResponse.json(customers);
}

export async function POST(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = customerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const repo = new CustomersRepository(tenantId);
        const customer = await repo.create(result.data);
        return NextResponse.json(customer, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
