import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const tenants = await prisma.tenant.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true }
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://agendapro.com.br';

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${baseUrl}</loc>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        ${tenants.map(tenant => `
            <url>
                <loc>${baseUrl}/${tenant.slug}</loc>
                <lastmod>${tenant.updatedAt.toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
        `).join('')}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
