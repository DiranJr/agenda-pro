import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { getTenantWebsite } from "@/lib/getTenantWebsite";

const websiteSchema = z.object({
    templateId: z.string(),
    content: z.object({
        brandName: z.string().optional(),
        headline: z.string().optional(),
        subheadline: z.string().optional(),
        logoUrl: z.string().optional().or(z.literal('')),
        heroImageUrl: z.string().optional().or(z.literal('')),
        whatsapp: z.string().optional().or(z.literal('')),
        instagram: z.string().optional().or(z.literal('')),
        address: z.string().optional().or(z.literal('')),
        galleryUrls: z.array(z.string()).optional(),
    }),
    flags: z.object({
        showPrices: z.boolean().default(true),
        showGallery: z.boolean().default(true),
        showStaff: z.boolean().default(true),
        showAddress: z.boolean().default(true),
    }),
    style: z.object({
        primaryColor: z.string().optional(),
    }),
    isPublished: z.boolean().optional(),
});

export async function GET(request) {
    const { tenant, error } = await getRequestContext({ request });
    if (error || !tenant) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Tenant nao resolvido" } }, { status: 401 });
    }

    const website = getTenantWebsite(tenant);

    return NextResponse.json({
        tenant: {
            ...tenant,
            website // Devolve a estrutura consolidada
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
        const result = websiteSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: { code: 'INVALID_INPUT', details: result.error.format() } }, { status: 400 });
        }

        const { isPublished, ...websiteData } = result.data;

        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                website: websiteData,
                isPublished: isPublished ?? true,
                publishedAt: (isPublished !== false) ? new Date() : undefined,

                // Sincroniza campos legados para não quebrar queries antigas em outros lugares (opcional)
                templateId: websiteData.templateId,
                customization: {
                    heroTitle: websiteData.content.headline,
                    heroSubtitle: websiteData.content.subheadline,
                    logoUrl: websiteData.content.logoUrl,
                    heroImageUrl: websiteData.content.heroImageUrl,
                    whatsapp: websiteData.content.whatsapp,
                    showPrices: websiteData.flags.showPrices,
                    galleryUrls: websiteData.content.galleryUrls
                }
            }
        });

        return NextResponse.json(updatedTenant);
    } catch (err) {
        console.error("PATCH Website Error:", err);
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: err.message } }, { status: 500 });
    }
}
