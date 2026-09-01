import jwt from 'jsonwebtoken';
import type { RoleList } from '../generated/prisma/client.js';

export interface AccessTokenPayload {
    userId: string;
    email: string;
    role: RoleList;
}

interface RefreshTokenPayload {
    userId: string;
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
