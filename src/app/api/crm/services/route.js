import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { ServicesRepository } from "@/domains/services/services.repository";
import { z } from "zod";

const serviceSchema = z.object({
    name: z.string().min(1),
    category: z.string().optional(),
    duration: z.number().int().positive(),
    price: z.number().positive(),
    bufferBefore: z.number().int().nonnegative().default(0),
    bufferAfter: z.number().int().nonnegative().default(0),
    active: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});

export async function GET(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }

    const repo = new ServicesRepository(db.tenantId);
    const services = await repo.getAll();
    return NextResponse.json(services);
}

export async function POST(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }

    try {
        const body = await request.json();
        const result = serviceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: "INVALID_INPUT", details: result.error.format() } }, { status: 400 });
        }

        const repo = new ServicesRepository(db.tenantId);
        const service = await repo.create(result.data);
        return NextResponse.json(service, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
    }
}
