import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const websiteConfigSchema = z.object({
    templateId: z.string(),
    customization: z.object({
        heroTitle: z.string().optional(),
        heroSubtitle: z.string().optional(),
        logoUrl: z.string().optional().or(z.literal('')),
        heroImageUrl: z.string().optional().or(z.literal('')),
        whatsapp: z.string().optional().or(z.literal('')),
        showPrices: z.boolean().default(true),
        galleryUrls: z.array(z.string()).optional().default([]),
    }),
    isPublished: z.boolean().optional(),
});

export async function GET(request) {
    const { tenant, error } = await getRequestContext({ request });
    if (error || !tenant) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }

    // Adapt legacy data if new fields are empty for smooth transition
    const adaptation = {
        templateId: tenant.templateId || tenant.theme?.layoutVariant || 'lash-beauty',
        customization: tenant.customization || {
            heroTitle: tenant.websiteConfig?.heroTitle || '',
            heroSubtitle: tenant.websiteConfig?.heroSubtitle || '',
            logoUrl: tenant.websiteConfig?.logoUrl || '',
            heroImageUrl: tenant.websiteConfig?.heroImageUrl || '',
            whatsapp: tenant.websiteConfig?.contactWhatsapp || '',
            showPrices: tenant.websiteConfig?.showPrices ?? true,
            galleryUrls: tenant.websiteConfig?.gallery || [],
        }
    };

    return NextResponse.json({
        tenant: {
            ...tenant,
            ...adaptation
        }
    });
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
                templateId: result.data.templateId,
                customization: result.data.customization,
                isPublished: result.data.isPublished ?? true,
                publishedAt: (result.data.isPublished !== false) ? new Date() : undefined,
            }
        });

        return NextResponse.json(updatedTenant);
    } catch (err) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
