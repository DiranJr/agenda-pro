import { apiResponse, apiError } from "@/lib/response";
import { generateAccessToken, generateRefreshToken } from "@/domains/auth/auth.service";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
            return apiError('INVALID_INPUT', result.error.format());
        }

        const { email, password } = result.data;

        // 1. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return apiError('UNAUTHORIZED', null, 'Credenciais inválidas');
        }

        // 2. Verificar senha com bcrypt
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return apiError('UNAUTHORIZED', null, 'Credenciais inválidas');
        }

        // 3. Gerar tokens
        const payload = { userId: user.id, tenantId: user.tenantId };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const response = apiResponse({ success: true });

        response.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
        });

        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return apiError('SERVER_ERROR');
    }
}
