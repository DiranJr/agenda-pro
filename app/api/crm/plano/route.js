import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const GET = withTenant(async (request, { db, tenant }) => {
    try {
        const planId = tenant.plan || 'start';
        const plan = PLANS[planId];

        // Count staff
        const staffCount = await prisma.staff.count({
            where: { tenantId: db.tenantId, status: 'ACTIVE' }
        });

        // Count services
        const servicesCount = await prisma.service.count({
            where: { tenantId: db.tenantId, active: true }
        });

        // Other basic usage stats
        const appointmentsCount = await prisma.appointment.count({
            where: { tenantId: db.tenantId }
        });

        const customersCount = await prisma.customer.count({
            where: { tenantId: db.tenantId }
        });

        // Count website gallery images
        const galleryUrls = tenant?.website?.content?.galleryUrls || tenant?.customization?.galleryUrls || [];
        const galleryCount = Array.isArray(galleryUrls) ? galleryUrls.length : 0;


        return apiResponse({
            planId,
            plan,
            usage: {
                staff: staffCount,
                services: servicesCount,
                gallery: galleryCount,
                appointments: appointmentsCount,
                customers: customersCount
            }
        });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
