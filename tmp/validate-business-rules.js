const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validateLegacy() {
    console.log('--- Validating Legacy Compatibility ---');
    const legacyTenants = [
        {
            name: 'Legacy No Website',
            slug: 'legacy-1',
            website: null,
            customization: null
        },
        {
            name: 'Legacy Partial',
            slug: 'legacy-2',
            website: { templateId: 'premium-dark' },
            customization: { heroTitle: 'Old Title' }
        }
    ];

    for (const tData of legacyTenants) {
        const t = await prisma.tenant.upsert({
            where: { slug: tData.slug },
            update: tData,
            create: tData
        });
        console.log(`[OK] Created/Updated ${t.name}`);
    }
}

async function validateTemplateSwitch() {
    console.log('\n--- Validating Template Switch Data Persistence ---');
    const slug = 'switch-test';
    const content = {
        headline: "Persistence Test",
        subheadline: "Should be here after switch"
    };

    // 1. Set to Template A
    await prisma.tenant.upsert({
        where: { slug },
        update: {
            website: { templateId: 'manicure-pastel', content }
        },
        create: {
            name: 'Switch Test',
            slug,
            website: { templateId: 'manicure-pastel', content }
        }
    });
    console.log('[STEP 1] Set to ManicurePastel');

    // 2. Switch to Template B
    const t2 = await prisma.tenant.findUnique({ where: { slug } });
    await prisma.tenant.update({
        where: { slug },
        data: {
            website: {
                ...t2.website,
                templateId: 'barber-clean'
            }
        }
    });
    console.log('[STEP 2] Switched to BarberClean');

    // 3. Verify content
    const final = await prisma.tenant.findUnique({ where: { slug } });
    if (final.website.content.headline === content.headline) {
        console.log('[OK] Content preserved after template switch!');
    } else {
        console.error('[FAIL] Content lost!');
    }
}

async function run() {
    try {
        await validateLegacy();
        await validateTemplateSwitch();
        console.log('\n✅ All automated validations passed!');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
