import { z } from 'zod';

export const OrderSchema = z.object({
    tableNumber: z.coerce.number().int().positive(),
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

export type OrderInput = z.infer<typeof OrderSchema>;
