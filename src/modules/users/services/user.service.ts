import createHttpError from 'http-errors';
import { prisma } from '../../../config/prisma.js';
import type { UserInput } from '../validations/user.schema.js';
import bcrypt from 'bcrypt';

// Get Users
export const getUsers = async () => {
    return await prisma.user.findMany();
};

// Create user
export const createUser = async (data: UserInput) => {
    const [existEmail, existTelp] = await Promise.all([
        prisma.user.findUnique({ where: { email: data.email } }),
        prisma.user.findUnique({ where: { telp: data.telp } }),
    ]);

    if (existEmail) {
        throw createHttpError.Conflict('Email Already Registered');
    }

    if (existTelp) {
        throw createHttpError.Conflict('No telp Already Registered');
    }

    // Cek Apakah Request Role Ada Dan Sama Seperti
    // Yang Ada Di Database?
    const role = await prisma.role.findUnique({
        where: { id: data.roleId },
    });

    if (!role) {
        throw createHttpError.BadRequest('Invalid RoleId');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            telp: data.telp,
            password: hashPassword,
            roleId: role.id,
        },
        select: {
            name: true,
            email: true,
            telp: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    return user;
};

// Update user
export const updateUser = async (userId: string, data: UserInput) => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user) {
        throw createHttpError.NotFound('User Not Founds');
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(data.password, 10);
    // Cek Apakah Request Role Ada Dan Sama Seperti
    // Yang Ada Di Database?
    const role = await prisma.role.findUnique({
        where: { id: data.roleId },
    });

    if (!role) {
        throw createHttpError.BadRequest('Invalid RoleId');
    }

    const result = await prisma.user.update({
        where: { id: user.id },
        data: {
            name: data.name,
            email: data.email,
            telp: data.telp,
            password: hashPassword,
            roleId: role.id,
        },
        select: {
            name: true,
            email: true,
            telp: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    return result;
};

// Delete User
export const deleteUser = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user) {
        throw createHttpError.NotFound('User Not Founds');
    }

    await prisma.user.delete({
        where: { id: user.id },
    });

    return;
};
