import { z } from 'zod';

// GetProductSchema
// For GET Product By Search & Filtering
export const GetProductSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    roleId: z.string().trim().optional(),
    sortBy: z.enum(['productName', 'price', 'createdAt']).default('createdAt'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

// ProductSchema
// For CREATE AND UPDATE PRODUCT
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

export type GetProductInput = z.infer<typeof GetProductSchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
