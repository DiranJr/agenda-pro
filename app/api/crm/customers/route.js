import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { CustomersRepository } from "@/domains/customers/customers.repository";
import { z } from "zod";

const customerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    noShows: z.number().int().nonnegative().default(0),
    tags: z.array(z.string()).default([]),
});

export const GET = withTenant(async (request, { db }) => {
    const repo = new CustomersRepository(db.tenantId);
    const customers = await repo.getAll();
    return apiResponse(customers);
});

export const POST = withTenant(async (request, { db }) => {
    try {
        const body = await request.json();
        const result = customerSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const repo = new CustomersRepository(db.tenantId);
        const customer = await repo.create(result.data);
        return apiResponse(customer, 201);
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
