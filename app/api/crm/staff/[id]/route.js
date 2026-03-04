import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { StaffRepository } from "@/domains/staff/staff.repository";
import { z } from "zod";

const updateStaffSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    locationId: z.string().optional().nullable(),
    serviceIds: z.array(z.string()).optional(),
});

export const PATCH = withTenant(async (request, { params, db }) => {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = updateStaffSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const { serviceIds, ...staffData } = result.data;
        const repo = new StaffRepository(db.tenantId);
        await repo.update(id, staffData);

        if (serviceIds) {
            await repo.setServices(id, serviceIds);
        }

        const updated = await repo.getById(id);

        return apiResponse(updated);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});

export const DELETE = withTenant(async (request, { params, db }) => {
    try {
        const { id } = await params;
        const repo = new StaffRepository(db.tenantId);
        await repo.delete(id);
        return apiResponse({ success: true });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
