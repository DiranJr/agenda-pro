import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { ServicesRepository } from "@/domains/services/services.repository";
import { z } from "zod";

const serviceSchema = z.object({
    name: z.string().min(1),
    category: z.string().optional(),
    duration: z.number().int().positive(),
    price: z.number().positive(),
    bufferBefore: z.number().int().nonnegative().default(0),
    bufferAfter: z.number().int().nonnegative().default(0),
    active: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

export const GET = withTenant(async (request, { db }) => {
    const repo = new ServicesRepository(db.tenantId);
    const services = await repo.getAll();
    return apiResponse(services);
});

export const POST = withTenant(async (request, { db }) => {
    try {
        const body = await request.json();
        const result = serviceSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const repo = new ServicesRepository(db.tenantId);
        const service = await repo.create(result.data);
        return apiResponse(service, 201);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
