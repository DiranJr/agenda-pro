const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Resetting and seeding initial data...');

    const hashedPassword = await bcrypt.hash('abracadabra', 10);

    // 1. Tenant (Upsert)
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'studio-josy' },
        update: {
            plan: 'pro',
            websiteConfig: {
                templateId: 'lash-beauty',
                heroTitle: 'Studio Josy Silva',
                heroSubtitle: 'Especialista em Cílios e Sobrancelhas',
                aboutText: 'Mais que um salão, um refúgio para sua beleza.',
                contactWhatsapp: '5511999999999',
                heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
            }
        },
        create: {
            name: 'Studio Josy Silva',
            slug: 'studio-josy',
            plan: 'pro',
            timezone: 'America/Sao_Paulo',
            websiteConfig: {
                templateId: 'lash-beauty',
                heroTitle: 'Studio Josy Silva',
                heroSubtitle: 'Especialista em Cílios e Sobrancelhas',
                aboutText: 'Mais que um salão, um refúgio para sua beleza.',
                contactWhatsapp: '5511999999999',
                heroImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
            },
            theme: {
                layoutVariant: 'elegant',
                colors: {
                    primary: '#6366f1',
                    secondary: '#a855f7',
                },
            }
        },
    });

    // 2. Admin (Upsert)
    await prisma.user.upsert({
        where: { email: 'admin@agendapro.com' },
        update: { password: hashedPassword, tenantId: tenant.id },
        create: {
            email: 'admin@agendapro.com',
            password: hashedPassword,
            name: 'Administrador',
            tenantId: tenant.id
        }
    });

    // 3. Location (Find or Create)
    let location = await prisma.location.findFirst({
        where: { tenantId: tenant.id, name: 'Unidade Principal' }
    });
    if (!location) {
        location = await prisma.location.create({
            data: { name: 'Unidade Principal', tenantId: tenant.id }
        });
    }

    // 4. Service (Upsert by tenantId_name if unique constraint exists, or just find)
    const service = await prisma.service.upsert({
        where: {
            tenantId_name: {
                tenantId: tenant.id,
                name: 'Extensão de Cílios Volume Russo'
            }
        },
        update: { price: 180.00 },
        create: {
            name: 'Extensão de Cílios Volume Russo',
            category: 'Lash',
            duration: 120,
            price: 180.00,
            tenantId: tenant.id,
            isFeatured: true,
            imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600',
        }
    });

    // 5. Staff (Upsert by tenantId_name)
    const staff = await prisma.staff.upsert({
        where: {
            tenantId_name: {
                tenantId: tenant.id,
                name: 'Josy Silva'
            }
        },
        update: { phone: '11999999999' },
        create: {
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
                sat: { active: true, start: '09:00', end: '14:00', breaks: [] },
                sun: { active: false, start: '09:00', end: '12:00', breaks: [] },
            }
        }
    });

    // 6. Link Staff to Service
    const existingLink = await prisma.staffService.findFirst({
        where: { staffId: staff.id, serviceId: service.id }
    });
    if (!existingLink) {
        await prisma.staffService.create({
            data: {
                staffId: staff.id,
                serviceId: service.id,
                tenantId: tenant.id
            }
        });
    }

    // 7. Test Customer
    await prisma.customer.upsert({
        where: {
            tenantId_phone: {
                tenantId: tenant.id,
                phone: '5511888888888'
            }
        },
        update: { tags: 'VIP' },
        create: {
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
