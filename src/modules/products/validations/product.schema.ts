import { z } from 'zod';

export const ProductSchema = z.object({
    productName: z
        .string()
        .trim()
        .min(1, 'productName Required')
        .max(255, 'productName Maximum 255 Character'),
    price: z.coerce.number().int().min(0).default(0),
    description: z.string().trim().optional(),
    imageCover: z.string().optional(),
    categoryId: z.string().min(1, 'CategoryId Required'),
    roleId: z.string().min(1, 'RoleId Required'),
});

export type ProductInput = z.infer<typeof ProductSchema>;
