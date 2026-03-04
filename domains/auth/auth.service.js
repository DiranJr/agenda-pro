import * as jose from 'jose';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'));

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Application must fail at startup as per requirements.');
}

export async function generateAccessToken(payload) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(payload) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token) {
    if (!token) return null;
    try {
        const { payload } = await jose.jwtVerify(token, ACCESS_TOKEN_SECRET);
        return payload;
    } catch (err) {
        console.error('JWT Verify Error (Access):', err.message);
        return null;
    }
}

export async function verifyRefreshToken(token) {
    if (!token) return null;
    try {
        const { payload } = await jose.jwtVerify(token, REFRESH_TOKEN_SECRET);
        return payload;
    } catch (err) {
        console.error('JWT Verify Error (Refresh):', err.message);
        return null;
    }
}
