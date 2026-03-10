const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTestTenants() {
    console.log("🌱 Limpando e Gerando Tenants, Serviços e Staff de Teste...\n");

    const testTenants = [
        {
            slug: 'crossfit-action',
            name: 'Action Cross Training',
            templateId: 'modern-studio',
            website: {
                templateId: 'modern-studio',
                content: {
                    brandName: "Action Cross",
                    headline: "SUPERE SEUS LIMITES HOJE",
                    subheadline: "Treinamento de alta performance para quem busca resultados reais.",
                    logoUrl: "",
                    heroImageUrl: "/test/gym.png",
                    whatsapp: "5511988887777",
                    galleryUrls: ["/test/gym.png"]
                },
                flags: { showPrices: true, showGallery: true, showStaff: true, showAddress: true },
                style: { primaryColor: '#DD1E22' }
            },
            services: [
                { name: 'Aula Experimental', duration: 60, price: 0 },
                { name: 'Mensalidade Full', duration: 60, price: 250 }
            ],
            staff: [{ name: 'Coach Ricardo' }]
        },
        {
            slug: 'odonto-premium',
            name: 'Odonto Premium Clinic',
            templateId: 'clean-clinic',
            website: {
                templateId: 'clean-clinic',
                content: {
                    brandName: "Odonto Premium",
                    headline: "Seu Sorriso, Nossa Prioridade",
                    subheadline: "Tecnologia de ponta e cuidado humanizado para sua saúde bucal.",
                    logoUrl: "",
                    heroImageUrl: "/test/clinic.png",
                    whatsapp: "5511977776666",
                    galleryUrls: ["/test/clinic.png"]
                },
                flags: { showPrices: false, showGallery: true, showStaff: true, showAddress: true },
                style: { primaryColor: '#0284C7' }
            },
            services: [
                { name: 'Limpeza e Profilaxia', duration: 40, price: 150 },
                { name: 'Avaliação Geral', duration: 30, price: 0 }
            ],
            staff: [{ name: 'Dra. Ana Beatrix' }]
        },
        {
            slug: 'vintage-barber',
            name: 'Vintage Gold Barber',
            templateId: 'premium-dark',
            website: {
                templateId: 'premium-dark',
                content: {
                    brandName: "Vintage Gold",
                    headline: "Mais que um Corte, uma Experiência",
                    subheadline: "Onde o clássico encontra a sofisticação masculina.",
                    logoUrl: "",
                    heroImageUrl: "/test/barber.png",
                    whatsapp: "5511966665555",
                    galleryUrls: ["/test/barber.png"]
                },
                flags: { showPrices: true, showGallery: true, showStaff: true, showAddress: true },
                style: { primaryColor: '#B45309' }
            },
            services: [
                { name: 'Corte de Cabelo', duration: 45, price: 70 },
                { name: 'Barba e Toalha Quente', duration: 30, price: 50 }
            ],
            staff: [{ name: 'Barbeiro Mestre Lucas' }]
        }
    ];

    for (const t of testTenants) {
        const { services, staff, ...tenantData } = t;

        // Create/Update Tenant
        const tenant = await prisma.tenant.upsert({
            where: { slug: t.slug },
            update: tenantData,
            create: tenantData
        });

        console.log(`✅ Tenant: ${tenant.slug}`);

        // Limpa serviços e staff antigos para evitar problemas de constraint no teste
        await prisma.staffService.deleteMany({ where: { tenantId: tenant.id } }).catch(() => { });
        await prisma.service.deleteMany({ where: { tenantId: tenant.id } });
        await prisma.staff.deleteMany({ where: { tenantId: tenant.id } });

        // Create Services
        const createdServices = [];
        for (const s of services) {
            const srv = await prisma.service.create({
                data: { ...s, tenantId: tenant.id, active: true }
            });
            createdServices.push(srv);
        }
        console.log(`   - ${services.length} serviços gerados.`);

        // Create Staff
        for (const st of staff) {
            const createdStaff = await prisma.staff.create({
                data: { ...st, tenantId: tenant.id, status: 'ACTIVE' }
            });

            // Associate staff with ALL services of this tenant
            for (const srv of createdServices) {
                await prisma.staffService.create({
                    data: { staffId: createdStaff.id, serviceId: srv.id, tenantId: tenant.id }
                });
            }
        }
        console.log(`   - Staff e associações geradas.`);
    }

    console.log("\n✨ Tenants de teste COMPLETOS! Verifique em /crm/website/preview-all");
}

seedTestTenants()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
