import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';

// get orderItem by assigned Role
export const getOrderItemByAssignedRole = async (userId: string) => {
    // Ambil user dengan role yang sesuai dengan JOB Desk
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user) {
        throw createHttpError.NotFound('User not found');
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
