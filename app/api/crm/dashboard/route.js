import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { DashboardRepository } from "@/domains/dashboard/dashboard.repository";

export const GET = withTenant(async (request, { db, tenant }) => {
    try {
        const repo = new DashboardRepository(db.tenantId, tenant.timezone);
        const stats = await repo.getStats();
        return apiResponse({ ...stats, slug: tenant.slug, adminName: tenant.name });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
