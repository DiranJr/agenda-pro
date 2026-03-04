import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    contactPhone: z.string().optional().nullable(),
    timezone: z.string().default('America/Sao_Paulo'),
});

export async function PATCH(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = settingsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: result.data
        });

        return NextResponse.json(updatedTenant);
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
