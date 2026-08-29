import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as OrderService from '../services/order.service.js';
import type { Request, Response } from 'express';
import { OrderSchema } from '../validations/order.schema.js';

// Create New Order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    // Validate
    const validateData = OrderSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const result = await OrderService.createOrder(validateData.data);
    return res.status(201).json({
        success: true,
        message: 'Successfully Create New Order',
        data: result,
    });
});
