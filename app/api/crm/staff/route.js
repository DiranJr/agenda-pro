import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { StaffRepository } from "@/domains/staff/staff.repository";
import { z } from "zod";

const staffSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    locationId: z.string().optional().nullable(),
    serviceIds: z.array(z.string()).optional(),
});

export const GET = withTenant(async (request, { db }) => {
    const repo = new StaffRepository(db.tenantId);
    const staff = await repo.getAll();
    return apiResponse(staff);
});

export const POST = withTenant(async (request, { db }) => {
    try {
        const body = await request.json();
        const result = staffSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const { serviceIds, ...staffData } = result.data;
        const repo = new StaffRepository(db.tenantId);

        // Limitação por Plano
        const { getLimit } = await import("@/lib/plans");
        const { prisma } = await import("@/lib/prisma");
        const currentCount = await prisma.staff.count({
            where: { tenantId: db.tenantId, status: "ACTIVE" }
        });
        const limit = getLimit(tenant.plan, "staff");

        if (currentCount >= limit) {
            return apiError('FORBIDDEN', `Seu plano (${tenant.plan.toUpperCase()}) permite no máximo ${limit} profissionais ativos.`);
        }

        const member = await repo.create(staffData);

        if (serviceIds) {
            await repo.setServices(member.id, serviceIds);
        }

        const created = await repo.getById(member.id);
        return apiResponse(created, 201);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
