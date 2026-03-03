import { getRequestContext } from "@/lib/context";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHomeUI from "./PublicHomeUI";

export default async function PublicTenantPage({ params }) {
    const { slug } = await params;
    const { tenant, error } = await getRequestContext({ slug });

    if (error || !tenant) {
        return notFound();
    }

    // Buscar serviços e profissionais para exibição imediata
    const services = await prisma.service.findMany({
        where: { tenantId: tenant.id, active: true },
        orderBy: { isFeatured: 'desc' }
    });

    const staff = await prisma.staff.findMany({
        where: { tenantId: tenant.id, status: 'ACTIVE' },
        include: { location: true }
    });

    // Extrair configuração de tema com fallbacks seguros
    const theme = tenant.theme || {};
    const colors = theme.colors || { primary: '#000000', secondary: '#666666' };

    return (
        <main
            style={{
                '--primary-color': colors.primary,
                '--secondary-color': colors.secondary,
                '--border-radius': theme.borderRadius || '1rem',
            }}
            className="min-h-screen bg-white"
        >
            <PublicHomeUI
                tenant={tenant}
                services={services}
                staff={staff}
            />
        </main>
    );
}
