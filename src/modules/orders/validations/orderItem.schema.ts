import { z } from 'zod';

// Schema Update Status Order Item
export const OrderItemUpdateStatus = z.object({
    status: z.enum(['pending', 'in_progress', 'ready', 'served', 'canceled']),
});

export type OrderItemUpdateInput = z.infer<typeof OrderItemUpdateStatus>;
