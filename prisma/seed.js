const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data...');

    const hashedPassword = await bcrypt.hash('abracadabra', 10);

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
                contactWhatsapp: '5511999999999',
                heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200', // Foto de salão premium
            },
            theme: {
                layoutVariant: 'elegant', // modern, minimal, glass, elegant, dark
                colors: {
                    primary: '#6366f1',
                    secondary: '#a855f7',
                },
            }
        },
    });

    // Criar Usuário Admin
    await prisma.user.upsert({
        where: { email: 'admin@agendapro.com' },
        update: { password: hashedPassword },
        create: {
            email: 'admin@agendapro.com',
            password: hashedPassword,
            name: 'Administrador',
            tenantId: tenant.id
        }
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
            imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600', // Foto de cílios
        },
    });

    const staff = await prisma.staff.create({
        data: {
            name: 'Josy Silva',
            phone: '11999999999',
            tenantId: tenant.id,
            locationId: location.id,
            workSchedule: {
                mon: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
                tue: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
                wed: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
                thu: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
                fri: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
                sat: { active: false, start: '09:00', end: '14:00', breaks: [] },
                sun: { active: false, start: '09:00', end: '12:00', breaks: [] },
            }
        },
    });

    await prisma.staffService.create({
        data: {
            staffId: staff.id,
            serviceId: service.id,
        },
    });

    await prisma.customer.create({
        data: {
            name: 'Maria Cliente VIP',
            phone: '5511888888888',
            email: 'maria@example.com',
            tags: 'VIP',
            tenantId: tenant.id
        }
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
