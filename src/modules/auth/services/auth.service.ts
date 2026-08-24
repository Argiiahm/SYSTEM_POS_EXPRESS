import createHttpError from 'http-errors';
import { primsa } from '../../../config/prisma.js';
import bcrypt from 'bcrypt';
import type { AuthInputLogin } from '../validations/auth.schema.js';
import { CreateAccessToken, CreateRefreshToken, VerifyRefreshToken } from '../../../utils/jwt.js';

// Login
export const login = async (data: AuthInputLogin) => {
    // Cek Data User, Apakah Sesuai?
    const user = await primsa.user.findFirst({
        where: { email: data.email },
    });

    if (!user) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // Cek Valid Password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // AccessToken & RefreshToken:
    // Generate TokenId dari crypto
    // Payload CreateAccessToken dari jwt.ts
    // Payload CreateRefreshToken dari jwt.ts
    // Hashing Token (RefreshToken)
    // Save RefreshToken ke Database

    // Generate TokenId
    const tokenId = crypto.randomUUID();

    // Payload AccessToken
    const AccessToken = CreateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // Payload RefreshToken
    const RefreshToken = CreateRefreshToken({
        userId: user.id,
        tokenId: tokenId,
    });

    // Hashing RefreshToken
    const tokenHash = await bcrypt.hash(RefreshToken, 10);

    // Save to Database RefreshToken
    await primsa.refreshToken.create({
        data: {
            id: tokenId,
            userId: user.id,
            tokenHash: tokenHash,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 Day
        },
    });

    return {
        AccessToken,
        RefreshToken,
    };
};

// Refresh
export const refresh = async (refreshToken: string) => {
    if (!refreshToken) {
        throw createHttpError.Unauthorized('RefreshToken Required');
    }

    // Verify RefreshToken
    const payload = VerifyRefreshToken(refreshToken);

    // Ambil Session atau Data - Data RefreshToken
    // Cek Semua, Apaakah valid?
    // Generate New AccessToken

    const session = await primsa.refreshToken.findFirst({
        where: { id: payload.tokenId },
        include: { user: true },
    });

    if (!session) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    if (session.expiresAt < new Date()) {
        throw createHttpError.Unauthorized('RefreshToken Expired');
    }

    if (session.revokedAt) {
        throw createHttpError.Unauthorized('RefreshToken Already Revoked');
    }

    // Samakan RefreshToken Dengan yang ada di database
    const compare = await bcrypt.compare(refreshToken, session.tokenHash);
    if (!compare) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    // Generate AccessToken Baru
    const AccessToken = CreateAccessToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
    });

    return {
        AccessToken,
    };
};

// Logout
export const logout = async (refreshToken: string) => {
    if (!refreshToken) {
        throw createHttpError.Unauthorized('RefreshToken Required');
    }

    const payload = VerifyRefreshToken(refreshToken);
    const session = await primsa.refreshToken.findFirst({
        where: { id: payload.tokenId },
    });

    if (!session) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    if (session.revokedAt) {
        throw createHttpError.Unauthorized('RefreshToken Already Revoked');
    }

    await primsa.refreshToken.update({
        where: { id: session.id },
        data: {
            revokedAt: new Date(),
        },
    });

    return;
};
