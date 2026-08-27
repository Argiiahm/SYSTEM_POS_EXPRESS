import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as RoleService from '../services/role.service.js';
import type { Request, Response } from 'express';

// get Roles
export const getRoles = asyncHandler(async (_req: Request, res: Response) => {
    const roles = await RoleService.getRoles();
    return res.status(200).json({
        success: true,
        message: 'Successfully get roles',
        data: roles,
    });
});
