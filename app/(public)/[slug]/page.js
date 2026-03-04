import { getRequestContext } from "@/lib/context";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHomeUI from "./PublicHomeUI";
import { SITE_TEMPLATES } from "@/lib/siteTemplates";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { tenant } = await getRequestContext({ slug });

    if (!tenant) return { title: 'Agenda Pro' };

    const customization = tenant.customization || {};
    const template = SITE_TEMPLATES[tenant.templateId || 'lash-beauty'] || SITE_TEMPLATES['lash-beauty'];
    const title = customization.heroTitle || template.defaults.heroTitle;
    const description = customization.heroSubtitle || template.defaults.heroSubtitle;

    return {
        title: `${tenant.name} - ${title}`,
        description: description,
        openGraph: {
            title: tenant.name,
            description: description,
            images: customization.logoUrl ? [customization.logoUrl] : [],
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
