import { getRequestContext } from "@/lib/context";
import { apiError } from "./response";

/**
 * Middleware-like helper for CRM routes to ensure a valid tenant context.
 * Useful for reducing boilerplate in API handlers.
 * 
 * @param {Function} handler - The async API handler (req, context) => Response
 * @returns {Function} Wrapped handler
 */
export function withTenant(handler) {
    return async (request, context) => {
        try {
            const { db, tenant, error } = await getRequestContext({ request });

            if (error || !tenant) {
                return apiError('UNAUTHORIZED', null, 'Contexto de tenant não encontrado ou inválido');
            }

            // Injeta o contexto db (com tenantId) e o próprio tenant no handler
            return await handler(request, { ...context, db, tenant });
        } catch (err) {
            console.error('withTenant error:', err);
            return apiError('SERVER_ERROR');
        }
    };
}
