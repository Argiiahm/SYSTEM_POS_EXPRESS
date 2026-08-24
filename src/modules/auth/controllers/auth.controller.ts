import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as AuthService from '../services/auth.service.js';
import type { Request, Response } from 'express';
import { AuthSchemaLogin } from '../validations/auth.schema.js';
import { cookieOptions } from '../../../constants/cookie.js';

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const validateData = AuthSchemaLogin.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const result = await AuthService.login(validateData.data);

    // Create Cookie (refreshToken)
    res.cookie('refreshToken', result.RefreshToken, cookieOptions);

    return res.status(200).json({
        success: true,
        data: {
            accessToken: result.AccessToken,
        },
    });
});

// Refresh
export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthService.refresh(refreshToken);
    return res.status(200).json({
        success: true,
        data: {
            accessToken: result.AccessToken,
        },
    });
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    await AuthService.logout(refreshToken);

    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json({
        success: true,
        message: 'Logout successfully.',
    });
});
