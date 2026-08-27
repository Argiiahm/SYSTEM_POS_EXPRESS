import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';
import type { ProductInput } from '../validations/product.schema.js';

// Get Products
export const getProducts = async () => {
    return await prisma.product.findMany({
        select: {
            id: true,
            productName: true,
            price: true,
            description: true,
            imageCover: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};

// Get ProductById
export const getProductById = async (productId: string) => {
    return await prisma.product.findFirst({
        where: { id: productId },
        select: {
            id: true,
            productName: true,
            price: true,
            description: true,
            imageCover: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};

// create Product
export const createProduct = async (data: ProductInput) => {
    const productName = data.productName.toLowerCase();
    const [product, category, role] = await Promise.all([
        prisma.product.findUnique({ where: { productName: productName } }),
        prisma.category.findFirst({ where: { id: data.categoryId } }),
        prisma.role.findFirst({ where: { id: data.roleId } }),
    ]);

    // Cek Apakah ProductName ini sudah ada?
    if (product) {
        throw createHttpError.Conflict('ProductName Already Exist');
    }

    // Cek Apakah Data CategoryId yang diinputkan
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!category) {
        throw createHttpError.BadRequest('Invalid CategoryId');
    }

    // Cek Apakah Data RoleId yang diinputkan
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!role) {
        throw createHttpError.BadRequest('Invalid RoleId');
    }

    const result = await prisma.product.create({
        data: {
            productName: productName,
            price: data.price,
            description: data.description ?? null,
            imageCover: data.imageCover ?? null,
            categoryId: category.id,
            roleId: role.id,
        },
        select: {
            id: true,
            productName: true,
            price: true,
            description: true,
            imageCover: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return result;
};

// update Product
export const updateProduct = async (productId: string, data: ProductInput) => {
    const productName = data.productName.toLowerCase();

    const [product, category, role] = await Promise.all([
        prisma.product.findFirst({ where: { id: productId } }),
        prisma.category.findFirst({ where: { id: data.categoryId } }),
        prisma.role.findFirst({ where: { id: data.roleId } }),
    ]);

    // Cek Apakah Data Prodouct id ini yang direquest
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!product) {
        throw createHttpError.NotFound('Product Not Found');
    }

    // Cek Apakah Data CategoryId yang diinputkan
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!category) {
        throw createHttpError.BadRequest('Invalid CategoryId');
    }

    // Cek Apakah Data RoleId yang diinputkan
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!role) {
        throw createHttpError.BadRequest('Invalid RoleId');
    }

    const result = await prisma.product.update({
        where: {
            id: product.id,
        },
        data: {
            productName: productName,
            price: data.price,
            description: data.description ?? null,
            imageCover: data.imageCover ?? null,
            categoryId: category.id,
            roleId: role.id,
        },
        select: {
            id: true,
            productName: true,
            price: true,
            description: true,
            imageCover: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return result;
};

// Delete Product
export const deleteProduct = async (productId: string) => {
    const product = await prisma.product.findFirst({ where: { id: productId } });
    // Cek Apakah Data Prodouct id ini yang direquest
    // oleh user itu ada atau sesuai dengan
    // yang ada di database?
    if (!product) {
        throw createHttpError.NotFound('Product Not Found');
    }

    await prisma.product.delete({
        where: { id: product.id },
    });

    return;
};
