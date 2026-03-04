import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { StaffRepository } from "@/domains/staff/staff.repository";
import { z } from "zod";

const staffSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    locationId: z.string().optional(),
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

        const repo = new StaffRepository(db.tenantId);
        const member = await repo.create(result.data);
        return apiResponse(member, 201);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
