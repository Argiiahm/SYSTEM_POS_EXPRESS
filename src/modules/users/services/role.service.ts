import { prisma } from '../../../config/prisma.js';

// get Roles
export const getRoles = async () => {
    return await prisma.role.findMany({
        select: {
            id: true,
            name: true,
        },
    });
};
