import jwt from 'jsonwebtoken';
import type { Role } from '../generated/prisma/client.js';

export interface AccessTokenPayload {
    id: string;
    email: string;
    role: Role;
}

interface RefreshTokenPayload {
    id: string;
    tokenId: string;
}

// createAccessToken
export function CreateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, process.env.ACCESS_KEY!, {
        expiresIn: '15m',
    });
}

// createRefreshToken
export function CreateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.REFRESH_KEY!, {
        expiresIn: '7d',
    });
}

// verify AccessToken
export function VerifyAccessToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_KEY!) as AccessTokenPayload;
}

// verify RefreshToken
export function VerifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.REFRESH_KEY!) as RefreshTokenPayload;
}
