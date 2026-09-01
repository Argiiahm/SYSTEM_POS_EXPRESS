import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as CategoryService from '../services/category.service.js';
import type { Request, Response } from 'express';
import { CategorySchema } from '../validations/category.schema.js';

// get Categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getCategories();
    return res.status(200).json({
        success: true,
        message: 'Successfully get categories',
        data: categories,
    });
});

// create Category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const validateData = CategorySchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const category = await CategoryService.createCategory(validateData.data);
    return res.status(201).json({
        success: true,
        message: 'successfully created category',
        data: category,
    });
});

//  update Category
export const updateCategory = asyncHandler(
    async (req: Request<{ categoryId: string }>, res: Response) => {
        const categoryId = req.params.categoryId;
        const validateData = CategorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }
        const category = await CategoryService.updateCategory(categoryId, validateData.data);
        return res.status(200).json({
            success: true,
            message: 'successfully updated category',
            data: category,
        });
    }
);

// delete Category
export const deleteCategory = asyncHandler(
    async (req: Request<{ categoryId: string }>, res: Response) => {
        const categoryId = req.params.categoryId;
        await CategoryService.deleteCategory(categoryId);
        return res.status(200).json({
            success: true,
            message: 'successfully deleted category',
        });
    }
);
