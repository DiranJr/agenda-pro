import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { FinanceRepository } from "@/domains/finance/finance.repository";

export const GET = withTenant(async (request, { db, tenant }) => {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return apiError('INVALID_INPUT', "Datas de início e fim são obrigatórias.");
        }

        const repo = new FinanceRepository(db.tenantId, tenant.timezone);
        const report = await repo.getReport({ startDate, endDate });

        return apiResponse(report);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
