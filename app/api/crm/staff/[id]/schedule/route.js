import { apiResponse, apiError } from "@/lib/response";
import { withTenant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const breakSchema = z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
});

const daySchema = z.object({
    active: z.boolean(),
    start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    breaks: z.array(breakSchema).optional().default([]),
});

const scheduleSchema = z.object({
    sun: daySchema,
    mon: daySchema,
    tue: daySchema,
    wed: daySchema,
    thu: daySchema,
    fri: daySchema,
    sat: daySchema,
});

export const GET = withTenant(async (request, { db, params }) => {
    const staff = await prisma.staff.findFirst({
        where: { id: params.id, tenantId: db.tenantId },
        select: { id: true, name: true, workSchedule: true }
    });

    if (!staff) return apiError('NOT_FOUND', null, 'Profissional não encontrado');
    return apiResponse(staff);
});

export const PATCH = withTenant(async (request, { db, params }) => {
    try {
        const body = await request.json();
        const result = scheduleSchema.safeParse(body);

        if (!result.success) {
            return apiError('INVALID_INPUT', result.error.format());
        }

        const updated = await prisma.staff.updateMany({
            where: { id: params.id, tenantId: db.tenantId },
            data: { workSchedule: result.data }
        });

        if (updated.count === 0) return apiError('NOT_FOUND', null, 'Profissional não encontrado');
        return apiResponse({ success: true, workSchedule: result.data });
    } catch (err) {
        return apiError('SERVER_ERROR', null, err.message);
    }
});
