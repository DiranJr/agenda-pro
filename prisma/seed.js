const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data...');

    const tenant = await prisma.tenant.upsert({
        where: { slug: 'studio-josy' },
        update: {},
        create: {
            name: 'Studio Josy Silva',
            slug: 'studio-josy',
            timezone: 'America/Sao_Paulo',
            websiteConfig: {
                heroTitle: 'Studio Josy Silva',
                heroSubtitle: 'Especialista em Cílios e Sobrancelhas',
                aboutText: 'Mais que um salão, um refúgio para sua beleza.',
            },
            theme: {
                colors: {
                    primary: '#6366f1',
                    secondary: '#a855f7',
                },
            }
        },
    });

    const location = await prisma.location.create({
        data: {
            name: 'Unidade Principal',
            tenantId: tenant.id,
        },
    });

    const service = await prisma.service.create({
        data: {
            name: 'Extensão de Cílios Volume Russo',
            category: 'Lash',
            duration: 120,
            price: 180.00,
            tenantId: tenant.id,
            isFeatured: true,
        },
    });

    const staff = await prisma.staff.create({
        data: {
            name: 'Josy Silva',
            phone: '11999999999',
            tenantId: tenant.id,
            locationId: location.id,
        },
    });

    await prisma.staffService.create({
        data: {
            staffId: staff.id,
            serviceId: service.id,
        },
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
