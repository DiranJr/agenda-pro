import { getRequestContext } from "@/lib/context";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHomeUI from "./PublicHomeUI";
import { getTenantWebsite } from "@/lib/getTenantWebsite";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { tenant } = await getRequestContext({ slug });

    if (!tenant) return { title: 'Agenda Pro' };

    const website = getTenantWebsite(tenant);
    const title = website.content.brandName || tenant.name;
    const headline = website.content.headline;

    return {
        title: `${title} - ${headline}`,
        description: website.content.subheadline,
        openGraph: {
            title: title,
            description: website.content.subheadline,
            images: website.content.logoUrl ? [website.content.logoUrl] : [],
        },
        viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    };
}

export default async function PublicTenantPage({ params }) {
    const { slug } = await params;
    const { tenant, error } = await getRequestContext({ slug });

    if (error || !tenant) {
        return notFound();
    }

    const services = await prisma.service.findMany({
        where: { tenantId: tenant.id, active: true },
        orderBy: { isFeatured: 'desc' }
    });

    const staff = await prisma.staff.findMany({
        where: { tenantId: tenant.id, status: 'ACTIVE' },
        include: {
            location: true,
            services: true
        }
    });

    return (
        <PublicHomeUI
            tenant={tenant}
            services={services}
            staff={staff}
        />
    );
}
