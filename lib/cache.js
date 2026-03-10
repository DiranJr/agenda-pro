/**
 * Camada de Cache (Fase 2 do Guia de Escalabilidade)
 * Começa como um "no-op" ou cache em memória simples,
 * preparado para ser substituído por Redis conforme o sistema cresce.
 */

const memoryCache = new Map();

export async function getCache(key) {
    // FASE 0-1: No-op ou memória simples
    if (process.env.REDIS_URL) {
        // Placeholder para Redis implementation
        // return redis.get(key);
    }

    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
        memoryCache.delete(key);
        return null;
    }

    return item.value;
}

export async function setCache(key, value, ttlSeconds = 3600) {
    if (process.env.REDIS_URL) {
        // Placeholder para Redis implementation
        // return redis.set(key, value, 'EX', ttlSeconds);
    }

    memoryCache.set(key, {
        value,
        expiresAt: Date.now() + (ttlSeconds * 1000)
    });
}

export async function invalidateCache(key) {
    if (process.env.REDIS_URL) {
        // return redis.del(key);
    }
    memoryCache.delete(key);
}
