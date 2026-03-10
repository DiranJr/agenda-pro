const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validate() {
    console.log("🔍 Iniciando validação de dados dos Tenants...\n");

    const tenants = await prisma.tenant.findMany();

    if (tenants.length === 0) {
        console.log("ℹ️ Nenhum tenant encontrado no banco de dados.");
        return;
    }

    const reports = tenants.map(t => {
        const website = t.website || {};
        const content = website.content || {};
        const customization = t.customization || {};
        const config = t.websiteConfig || {};

        const brandName = content.brandName || t.name || "";
        const headline = content.headline || customization.heroTitle || config.heroTitle || "";
        const subheadline = content.subheadline || customization.heroSubtitle || config.heroSubtitle || "";

        return {
            slug: t.slug,
            brandName: { value: brandName, length: brandName.length, valid: brandName.length <= 30 },
            headline: { value: headline, length: headline.length, valid: headline.length <= 60 },
            subheadline: { value: subheadline, length: subheadline.length, valid: subheadline.length <= 140 }
        };
    });

    console.log("📊 RESULTADO DA VALIDAÇÃO:\n");

    let issuesFound = false;
    reports.forEach(r => {
        let tenantIssue = false;
        const issues = [];

        if (!r.brandName.valid) { issues.push(`Marca muito longa: ${r.brandName.length}/30`); tenantIssue = true; }
        if (!r.headline.valid) { issues.push(`Título muito longo: ${r.headline.length}/60`); tenantIssue = true; }
        if (!r.subheadline.valid) { issues.push(`Subtítulo muito longo: ${r.subheadline.length}/140`); tenantIssue = true; }

        if (tenantIssue) {
            issuesFound = true;
            console.log(`❌ Tenant: ${r.slug}`);
            issues.forEach(issuedesc => console.log(`   - ${issuedesc}`));
            console.log(`     Headline: "${r.headline.value}"`);
            console.log(`     Subtítulo: "${r.subheadline.value.substring(0, 50)}..."\n`);
        } else {
            console.log(`✅ Tenant: ${r.slug} - OK`);
        }
    });

    if (!issuesFound) {
        console.log("\n✨ Todos os tenants estão dentro dos novos limites visuais!");
    }
}

validate()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
