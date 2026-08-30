import createHttpError from 'http-errors';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as OrderItemService from '../services/orderItem.service.js';
import type { Request, Response } from 'express';
import {
    OrderItemUpdateStatus,
    type OrderItemUpdateInput,
} from '../validations/orderItem.schema.js';

// get orderItem by assigned Role FoodKitchen
export const getOrderItemByAssignedRole = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw createHttpError.Unauthorized('Unauthorization');
    }

    const userId = req.user.userId;

    // Get Data OrderItem
    const orderItems = await OrderItemService.getOrderItemByAssignedRole(userId);
    return res.status(200).json({
        success: true,
        data: orderItems,
    });
});

// update status
export const updateStatusItem = asyncHandler(
    async (req: Request<{ itemId: string }, object, OrderItemUpdateInput>, res: Response) => {
        // Req user
        if (!req.user || !req.user.userId) {
            throw createHttpError.Unauthorized('Unauthorization');
        }

        // userId
        const userId = req.user.userId;
        // itemId
        const itemId = req.params.itemId;

        const validateData = OrderItemUpdateStatus.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const orderItem = await OrderItemService.updateStatusItem(
            itemId,
            userId,
            validateData.data
        );

        return res.status(200).json({
            success: true,
            message: 'Successfully update orderItem',
            data: orderItem,
        });
    }
);
