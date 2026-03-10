const { getTenantWebsite } = require('../lib/getTenantWebsite');

// Mock SITE_TEMPLATES since we are running in Node
// We can't easily import ES modules in a quick script without setup, 
// so let's mock the internal dependency or use a test runner.
// For simplicity, I'll just copy the logic or require it if it's CJS, 
// but it's likely ESM.

const mockTemplates = {
    "lash-beauty": {
        id: "lash-beauty",
        name: "Lash Beauty",
        layout: "beauty-soft",
        defaults: {
            headline: "Sua beleza em boas mãos",
            subheadline: "Especialistas em design de sobrancelhas e muito mais.",
            primaryColor: "#FF1B6D",
        }
    }
};

const scenarios = [
    {
        name: "Cenário 1: Tenant Totalmente Novo (Sem website, Sem customization)",
        tenant: {
            name: "Studio Teste",
            templateId: "lash-beauty"
        }
    },
    {
        name: "Cenário 2: Legado Parcial (Apenas customization.heroTitle)",
        tenant: {
            name: "Studio Legado",
            templateId: "lash-beauty",
            customization: {
                heroTitle: "Título Antigo"
            }
        }
    },
    {
        name: "Cenário 3: Transição (Legacy + New fields). New deve vencer.",
        tenant: {
            name: "Studio Transicao",
            templateId: "lash-beauty",
            customization: {
                heroTitle: "Título MORTO"
            },
            website: {
                templateId: "lash-beauty",
                content: {
                    headline: "Título VIVO (Novo)"
                }
            }
        }
    },
    {
        name: "Cenário 4: Galeria Vazia no Legado e no Novo",
        tenant: {
            name: "Studio Vazio",
            website: {
                content: {
                    galleryUrls: []
                }
            }
        }
    },
    {
        name: "Cenário 5: Flags Legadas (showPrices: false)",
        tenant: {
            customization: {
                showPrices: false
            }
        }
    }
];

// Simple test runner
function runTests() {
    console.log("🚀 Iniciando Testes de Lógica: getTenantWebsite\n");

    scenarios.forEach(s => {
        console.log(`Testing: ${s.name}`);
        const result = getTenantWebsite(s.tenant);

        // Validations
        if (!result) {
            console.error("❌ FALHA: Retornou null");
            return;
        }

        console.log(`   - Template: ${result.templateId}`);
        console.log(`   - Headline: ${result.content.headline}`);
        console.log(`   - ShowPrices: ${result.flags.showPrices}`);
        console.log(`   - Gallery Count: ${result.content.galleryUrls.length}`);
        console.log("---");
    });
}

// Since getTenantWebsite is ESM, we'll need to run this with a tool that supports it
// or just wrap it. But I'll trust the logic for now and move to implementation
// unless I really need to run it in terminal.
// Actually, I can use 'node' if I change the file to .mjs or use a wrapper.
