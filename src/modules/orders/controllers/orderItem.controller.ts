import createHttpError from 'http-errors';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as OrderItemService from '../services/orderItem.service.js';
import type { Request, Response } from 'express';

// get orderItem by assigned Role FoodKitchen
export const getOrderItemByAssignedRole = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        throw createHttpError.Unauthorized('Unauthorization');
    }

    const userId = req.user.userId;

    // Get Data
    const orderItems = await OrderItemService.getOrderItemByAssignedRole(userId);
    return res.status(200).json({
        success: true,
        data: orderItems,
    });
});
