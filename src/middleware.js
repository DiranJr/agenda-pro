import { NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/domains/auth/auth.service';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Proteção de rotas do CRM (/admin ou /crm)
    if (pathname.startsWith('/admin') || pathname.startsWith('/crm')) {
        const accessToken = request.cookies.get('access_token')?.value;
        const refreshToken = request.cookies.get('refresh_token')?.value;

        if (!accessToken && !refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = verifyAccessToken(accessToken);

        if (!payload && refreshToken) {
            // Tentar renovar o access token
            const refreshPayload = verifyRefreshToken(refreshToken);
            if (refreshPayload) {
                const newAccessToken = generateAccessToken({
                    userId: refreshPayload.userId,
                    tenantId: refreshPayload.tenantId
                });

                const response = NextResponse.next();
                response.cookies.set('access_token', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15m
                });
                return response;
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/crm/:path*'],
};
