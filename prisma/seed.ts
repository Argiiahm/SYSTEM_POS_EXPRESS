import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('roleadmin123', 10);

    await prisma.user.upsert({
        where: {
            email: 'corpadmin@gmail.com',
        },
        update: {},
        create: {
            name: 'admin',
            email: 'corpadmin@gmail.com',
            telp: '0821990201',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('Admin seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
