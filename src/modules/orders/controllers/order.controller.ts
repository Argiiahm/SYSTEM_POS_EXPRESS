import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as OrderService from '../services/order.service.js';
import type { Request, Response } from 'express';
import { GetOrderSchmea, OrderSchema, PaymentMethodSchema } from '../validations/order.schema.js';

// Get Orders
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const validateData = GetOrderSchmea.safeParse(req.query);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }
    const orders = await OrderService.getOrders(validateData.data);
    return res.status(200).json({
        success: true,
        data: orders,
    });
});

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

// Completed Order & Create Payment (ROLE: Cashier)
export const completedOrder = asyncHandler(
    async (req: Request<{ orderId: string }>, res: Response) => {
        const orderId = req.params.orderId;
        const validateData = PaymentMethodSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const result = await OrderService.completedOrder(orderId, validateData.data);
        return res.status(200).json({
            success: true,
            message: 'Successfully Completed Order',
            data: result,
        });
    }
);
