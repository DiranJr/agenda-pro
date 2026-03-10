import { prisma } from "@/lib/prisma";

export default async function sitemap() {
    const tenants = await prisma.tenant.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true }
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://agendapro.com.br';

    const tenantEntries = tenants.map(tenant => ({
        url: `${baseUrl}/${tenant.slug}`,
        lastModified: tenant.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...tenantEntries
    ];
}
