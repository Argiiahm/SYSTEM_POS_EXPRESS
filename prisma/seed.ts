import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const roles = ['admin', 'waiter', 'cashier', 'foodKitchen', 'beverageStation'] as const;

    // Seed Roles
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: {
                name: roleName,
            },
            update: {},
            create: {
                name: roleName,
            },
        });
    }

    // Ambil role admin
    const adminRole = await prisma.role.findUnique({
        where: {
            name: 'admin',
        },
    });

    if (!adminRole) {
        throw new Error('Admin role not found');
    }

    const hashedPassword = await bcrypt.hash('roleadmin123', 10);

    // Seed Admin User
    await prisma.user.upsert({
        where: {
            email: 'corpadmin@gmail.com',
        },
        update: {},
        create: {
            name: 'Corporate Admin',
            email: 'corpadmin@gmail.com',
            telp: '0821990201',
            password: hashedPassword,
            roleId: adminRole.id,
        },
    });

    console.log('Roles seeded successfully');
    console.log('Admin user seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
