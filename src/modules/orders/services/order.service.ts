import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';
import type { OrderInput } from '../validations/order.schema.js';

// Create New Order
export const createOrder = async (data: OrderInput) => {
    // Ambil Semua Data Yang Dipesan
    const productIds = data.items.map((item) => item.productId);

    // Cek Product Dan Cek Waiter atau yang melayani
    const [products, waiter] = await Promise.all([
        prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            include: {
                role: true,
            },
        }),

        prisma.user.findFirst({
            where: { id: data.waiterId },
        }),
    ]);

    // Pastikan Semua Product ditemukan
    if (products.length !== productIds.length) {
        throw createHttpError.NotFound('Some products were not found');
    }

    // Pastikan WaiterId Valid
    if (!waiter) {
        throw createHttpError.NotFound('Invalid WaiterId');
    }

    // validasi dan Hitung Order Item
    let totalAmount = 0;

    // Order Item
    const orderItems = data.items.map((item) => {
        // Linear Search — cari sebuah data dengan cek elemen array satu per satu sampai ketemu.
        const product = products.find((product) => product.id === item.productId);

        if (!product) {
            throw createHttpError.NotFound(`Product ${item.productId} not found`);
        }

        // Product Harus Punya AssigenRoled atau RoleId
        // Untuk di prosess oleh role sesuai job desk
        if (!product.roleId) {
            throw createHttpError.BadRequest(`Product ${product.productName} has no assigned role`);
        }

        // Hitung Subtotal
        const subTotal = product.price * item.quantity;
        totalAmount += subTotal;

        return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
            subTotal,
            assignedRoleId: product.roleId,
            notes: item.notes ?? null,
        };
    });

    // generate OrderId format
    const today = new Date();
    const date = today.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORDER-${date}-${random}`;

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
        // Creater Order
        const order = await tx.order.create({
            data: {
                id: orderId,
                tableNumber: data.tableNumber,
                waiterId: data.waiterId,
                totalAmount,
            },
        });

        // Create OrderItem
        for (const item of orderItems) {
            await tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    price: item.price,
                    quantity: item.quantity,
                    subTotal: item.subTotal,
                    assignedRoleId: item.assignedRoleId,
                    notes: item.notes,
                },
            });
        }

        // return order + items
        return await tx.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true },
        });
    });

    return result;
};
