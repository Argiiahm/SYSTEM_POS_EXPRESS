import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';
import type { OrderItemUpdateInput } from '../validations/orderItem.schema.js';

// get orderItem by assigned Role
export const getOrderItemByAssignedRole = async (userId: string) => {
    // Ambil user dengan role yang sesuai dengan JOB Desk
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    const orderItems = await prisma.orderItem.findMany({
        where: {
            assignedRoleId: user.roleId,
        },
        select: {
            id: true,
            orderId: true,
            product: {
                select: {
                    imageCover: true,
                    productName: true,
                },
            },
            quantity: true,
            notes: true,
            status: true,
        },
    });

    return orderItems;
};

// Update Status Order Item
export const updateStatusItem = async (
    itemId: string,
    userId: string,
    data: OrderItemUpdateInput
) => {
    const [orderItem, user] = await Promise.all([
        prisma.orderItem.findFirst({ where: { id: itemId } }),
        prisma.user.findFirst({ where: { id: userId } }),
    ]);

    if (!orderItem) {
        throw createHttpError.NotFound('orderItem Not Found');
    }

    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    if (orderItem.assignedRoleId !== user.roleId) {
        throw createHttpError.NotFound('orderItem Not Found');
    }

    const result = await prisma.orderItem.update({
        where: { id: orderItem.id },
        data: {
            status: data.status ?? 'pending',
        },
        select: {
            id: true,
            orderId: true,
            product: {
                select: {
                    imageCover: true,
                    productName: true,
                },
            },
            quantity: true,
            notes: true,
            status: true,
        },
    });

    return result;
};
