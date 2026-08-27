import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as ProductService from '../services/product.service.js';
import type { Request, Response } from 'express';
import { ProductSchema, type ProductInput } from '../validations/product.schema.js';

// get Products
export const getProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await ProductService.getProducts();
    return res.status(200).json({
        success: true,
        message: 'Successfully get products',
        data: products,
    });
});

// get Product By Id
export const getProductById = asyncHandler(
    async (req: Request<{ productId: string }>, res: Response) => {
        const productId = req.params.productId;
        const product = await ProductService.getProductById(productId);
        return res.status(200).json({
            success: true,
            message: 'Successfully get product',
            data: product,
        });
    }
);

// create Product
export const createProduct = asyncHandler(
    async (req: Request<object, object, ProductInput>, res: Response) => {
        const validateData = ProductSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // Create Product
        const product = await ProductService.createProduct(validateData.data);
        return res.status(201).json({
            success: true,
            message: 'Successfully created product',
            data: product,
        });
    }
);

// update Product
export const updateProduct = asyncHandler(
    async (req: Request<{ productId: string }, object, ProductInput>, res: Response) => {
        const productId = req.params.productId;
        const validateData = ProductSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // Update Product
        const product = await ProductService.updateProduct(productId, validateData.data);
        return res.status(200).json({
            success: true,
            message: 'Successfully updated product',
            data: product,
        });
    }
);

// Delete Product
export const deleteProduct = asyncHandler(
    async (req: Request<{ productId: string }>, res: Response) => {
        const productId = req.params.productId;
        await ProductService.deleteProduct(productId);
        // Delete Product
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted product',
        });
    }
);
