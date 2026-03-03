import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/domains/auth/auth.service";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: { code: 'INVALID_INPUT', message: 'Dados inválidos', details: result.error.format() } },
                { status: 400 }
            );
        }

        // Mock bypass para desenvolvimento inicial
        // Em produção, verificaríamos no Prisma com hash seguro (bcrypt/argon2)
        const { email, password } = result.data;

        if (email === "admin@agendapro.com" && password === "abracadabra") {
            const payload = { userId: "user_123", tenantId: "tenant_123" };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            const response = NextResponse.json({ success: true });

            response.cookies.set('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60, // 15m
            });

            response.cookies.set('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 7d
            });

            return response;
        }

        return NextResponse.json(
            { error: { code: 'UNAUTHORIZED', message: 'Credenciais inválidas' } },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: { code: 'SERVER_ERROR', message: 'Erro interno no servidor' } },
            { status: 500 }
        );
    }
}
