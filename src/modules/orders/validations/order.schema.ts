import { z } from 'zod';

// Get Order Schema
export const GetOrderSchmea = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    status: z.enum(['open', 'paid']).default('open'),
    sortBy: z.enum(['tableName', 'status', 'createdAt']).default('createdAt'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

// Order Schema
export const OrderSchema = z.object({
    tableNumber: z.string().trim(),
    waiterId: z.string().trim().min(1, 'waiterId Required'),
    items: z
        .array(
            z.object({
                productId: z.string().trim().min(1, 'productId Required'),
                quantity: z.coerce.number().int().positive(),
                notes: z.string().trim().optional(),
            })
        )
        .min(1, 'Order must have at least one item'),
});

// Payment Method Schema
export const PaymentMethodSchema = z.object({
    method: z.enum(['cash', 'qris']).default('cash'),
});

export type GetOrderInput = z.infer<typeof GetOrderSchmea>;
export type OrderInput = z.infer<typeof OrderSchema>;
export type PaymentMethodInput = z.infer<typeof PaymentMethodSchema>;
