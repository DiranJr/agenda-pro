import { apiError } from "./response";
import { getRequestContext } from "./context";
import { prisma } from "./prisma";
import { hasFeature } from "./plans";

/**
 * Higher-order function to protect API routes based on tenant plan features.
 */
export function withFeature(feature, handler) {
    return async (request, context) => {
        const { db, tenant, error } = await getRequestContext({ request });

        if (error || !db?.tenantId || !tenant) {
            return apiError('UNAUTHORIZED', "Sessão expirada ou tenant inválido.");
        }

        if (!hasFeature(tenant.plan || 'start', feature)) {
            return apiError('FORBIDDEN', `O seu plano atual não possui acesso à funcionalidade: ${feature}`);
        }

        // Injeta o contexto no handler
        return handler(request, { ...context, db, tenant });
    };
}
