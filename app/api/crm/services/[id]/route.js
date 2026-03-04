import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { ServicesRepository } from "@/domains/services/services.repository";
import { z } from "zod";

const updateServiceSchema = z.object({
    name: z.string().min(1).optional(),
    category: z.string().optional(),
    duration: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    active: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

export const PATCH = withTenant(async (request, { params, db }) => {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = updateServiceSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const repo = new ServicesRepository(db.tenantId);
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
        const repo = new ServicesRepository(db.tenantId);
        await repo.delete(id);
        return apiResponse({ success: true });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
