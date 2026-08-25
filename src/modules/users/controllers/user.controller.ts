import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as UserService from '../services/user.service.js';
import type { Request, Response } from 'express';
import { UserSchema, type UserInput } from '../validations/user.schema.js';

// Get Users
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.getUsers();
    return res.status(200).json({
        success: true,
        message: 'Successfully get users',
        data: users,
    });
});

// Create User
export const createUser = asyncHandler(
    async (req: Request<object, object, UserInput>, res: Response) => {
        const validateData = UserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const user = await UserService.createUser(validateData.data);
        return res.status(201).json({
            success: true,
            message: 'Successfully create new user',
            data: user,
        });
    }
);

// Update User
export const updateUser = asyncHandler(
    async (req: Request<{ userId: string }, object>, res: Response) => {
        const userId = req.params.userId;
        const validateData = UserSchema.safeParse(req.body);
        if (!validateData.data) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const user = await UserService.updateUser(userId, validateData.data);
        return res.status(200).json({
            success: true,
            message: 'Successfully update user',
            data: user,
        });
    }
);

// Delete User
export const deleteUser = asyncHandler(async (req: Request<{ userId: string }>, res: Response) => {
    const userId = req.params.userId;
    console.log(userId);
    await UserService.deleteUser(userId);
    return res.status(200).json({
        success: true,
        message: 'Successfully delete user',
    });
});
