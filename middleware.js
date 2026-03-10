import { NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/domains/auth/auth.service';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const ip = request.ip || '127.0.0.1';

    // --- 1. Rate Limiting (Ant-DDoS básico) ---
    // Em produção, isso deve usar Redis (Upstash) para ser cluster-safe.
    // Aqui implementamos um placeholder que loga se houver excesso (simulado).
    const isApiRequest = pathname.startsWith('/api/');
    if (isApiRequest) {
        // Ex: 100 requests por minuto por IP
        // placeholder: console.log(`[RateLimit] Request from ${ip} to ${pathname}`);
    }

    // --- 2. CORS (Proteção de Endpoints) ---
    // Adiciona headers de segurança globais
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Proteção de rotas do CRM (/admin ou /crm)
    if (pathname.startsWith('/admin') || pathname.startsWith('/crm')) {
        const accessToken = request.cookies.get('access_token')?.value;
        const refreshToken = request.cookies.get('refresh_token')?.value;

        if (!accessToken && !refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyAccessToken(accessToken);

        if (!payload && refreshToken) {
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if (refreshPayload) {
                const newAccessToken = await generateAccessToken({
                    userId: refreshPayload.userId,
                    tenantId: refreshPayload.tenantId
                });

                const authResponse = NextResponse.next();
                // Copia headers de segurança para a nova resposta
                response.headers.forEach((value, key) => authResponse.headers.set(key, value));

                authResponse.cookies.set('access_token', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15m
                });
                return authResponse;
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/crm/:path*'],
};
