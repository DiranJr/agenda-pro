const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const tenants = await prisma.tenant.findMany();
        console.log('Tenants found:', tenants.length);
        process.exit(0);
    } catch (e) {
        console.error('Database connection error:', e);
        process.exit(1);
    }
}

test();
