import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { CustomersRepository } from "@/domains/customers/customers.repository";
import { z } from "zod";

const updateCustomerSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')).nullable(),
    noShows: z.number().int().nonnegative().optional(),
    tags: z.array(z.string()).or(z.string()).optional(),
});

export const PATCH = withTenant(async (request, { params, db }) => {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = updateCustomerSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const repo = new CustomersRepository(db.tenantId);
        await repo.update(id, result.data);
        const updated = await repo.getById(id);

        return apiResponse(updated);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});

export const DELETE = withTenant(async (request, { params, db }) => {
    try {
        const { id } = await params;
        const repo = new CustomersRepository(db.tenantId);
        await repo.delete(id);
        return apiResponse({ success: true });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
