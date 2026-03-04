import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const websiteConfigSchema = z.object({
    theme: z.object({
        colors: z.object({
            primary: z.string().startsWith('#'),
            secondary: z.string().startsWith('#'),
        }),
        borderRadius: z.string().optional(),
        layoutVariant: z.string().optional(),
    }),
    websiteConfig: z.object({
        heroTitle: z.string().optional(),
        heroSubtitle: z.string().optional(),
        logoUrl: z.string().url().optional().or(z.literal('')),
        heroImageUrl: z.string().url().optional().or(z.literal('')),
        showPrices: z.boolean().default(true),
        gallery: z.array(z.string().url()).optional().default([]),
    }),
});

export async function GET(request) {
    const { tenant, error } = await getRequestContext({ request });
    if (error || !tenant) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    return NextResponse.json({ tenant });
}

export async function PATCH(request) {
    const { db, error } = await getRequestContext({ request });
    if (error || !db?.tenantId) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }
    const tenantId = db.tenantId;

    try {
        const body = await request.json();
        const result = websiteConfigSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                theme: result.data.theme,
                websiteConfig: result.data.websiteConfig,
            }
        });

        return NextResponse.json(updatedTenant);
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
