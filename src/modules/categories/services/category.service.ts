import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';
import type { CategoryInput } from '../validations/category.schema.js';

// Get Categories
export const getCategories = async () => {
    return await prisma.category.findMany();
};

// create Category
export const createCategory = async (data: CategoryInput) => {
    const categoryName = data.name.trim().toLowerCase();
    const existCategoryName = await prisma.category.findUnique({
        where: { name: categoryName },
    });

    if (existCategoryName) {
        throw createHttpError.Conflict('categoryName Already exist');
    }

    const category = await prisma.category.create({
        data: { name: categoryName },
        select: {
            id: true,
            name: true,
        },
    });

    return category;
};

// update Category
export const updateCategory = async (categoryId: string, data: CategoryInput) => {
    const category = await prisma.category.findFirst({
        where: { id: categoryId },
    });

    if (!category) {
        throw createHttpError.BadRequest('Invalid CategoryId');
    }

    const categoryName = data.name.trim().toLowerCase();

    const result = await prisma.category.update({
        where: { id: category.id },
        data: {
            name: categoryName,
        },
        select: {
            id: true,
            name: true,
        },
    });

    return result;
};

// Delete Category
export const deleteCategory = async (categoryId: string) => {
    const category = await prisma.category.findFirst({
        where: { id: categoryId },
    });

    if (!category) {
        throw createHttpError.BadRequest('Invalid CategoryId');
    }

    await prisma.category.delete({
        where: { id: category.id },
    });

    return;
};
