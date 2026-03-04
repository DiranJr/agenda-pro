import { prisma } from "./prisma";
import { verifyAccessToken } from "../domains/auth/auth.service";

function readAccessTokenFromRequest(request) {
    if (!request) return null;

    if (request.cookies && typeof request.cookies.get === "function") {
        return request.cookies.get("access_token")?.value || null;
    }

    const cookieHeader = request.headers?.get?.("cookie") || request.headers?.cookie;
    if (!cookieHeader) return null;

    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("access_token="));

    return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
}

async function findTenantById(id) {
    if (!id) return null;

    return prisma.tenant.findUnique({
        where: { id },
    });
}

/**
 * Resolve o contexto da requisicao (Tenant, Usuario, Timezone).
 * Centraliza a logica de isolamento por tenant.
 */
export async function getRequestContext({ slug, userId, tenantId, request } = {}) {
    let tenant = null;

    if (slug) {
        tenant = await prisma.tenant.findUnique({
            where: { slug },
        });
    }

    if (!tenant && tenantId) {
        tenant = await findTenantById(tenantId);
    }

    if (!tenant && request) {
        const accessToken = readAccessTokenFromRequest(request);
        const payload = accessToken ? await verifyAccessToken(accessToken) : null;
        tenant = await findTenantById(payload?.tenantId);
    }

    if (!tenant && userId) {
        // Futuro: resolver tenant por vinculo de usuario/staff.
    }

    if (!tenant) {
        return {
            tenant: null,
            timezone: "UTC",
            error: "Tenant not found",
        };
    }

    return {
        tenant,
        timezone: tenant.timezone || "UTC",
        db: {
            tenantId: tenant.id,
        },
    };
}
