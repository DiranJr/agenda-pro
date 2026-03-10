/**
 * SITE_TEMPLATES defines the "Commercial Templates" available to the user.
 * Each refers to a technical "layout" and provides default content/style.
 */
export const SITE_TEMPLATES = {
    "lash-beauty": {
        id: "lash-beauty",
        name: "Lash Beauty",
        category: "beauty",
        desc: "Elegante e feminino. Rosa suave com toques dourados.",
        layout: "beauty-soft", // Technical layout
        defaults: {
            headline: "Sua beleza em boas mãos",
            subheadline: "Especialistas em design de sobrancelhas e muito mais.",
            primaryColor: "#FF1B6D",
        }
    },
    "dark-luxury": {
        id: "dark-luxury",
        name: "Dark Luxury",
        category: "luxury",
        desc: "Sofisticado e premium. Preto com detalhes em rose gold.",
        layout: "premium-dark",
        defaults: {
            headline: "Beleza refinada com exclusividade",
            subheadline: "Tratamentos de alto padrão em um ambiente reservado.",
            primaryColor: "#D4AF37",
        }
    },
    "natural-spa": {
        id: "natural-spa",
        name: "Natural Spa",
        category: "wellness",
        desc: "Clean e minimalista. Verde natural com bege.",
        layout: "beauty-soft",
        defaults: {
            headline: "Seu momento de reconexão",
            subheadline: "Relaxe e renove suas energias com nossos tratamentos holísticos.",
            primaryColor: "#4A5D4E",
        }
    },
    "urban-barber": {
        id: "urban-barber",
        name: "Urban Barber",
        category: "barber",
        desc: "Masculino e moderno. Cinza escuro com laranja vibrante.",
        layout: "premium-dark",
        defaults: {
            headline: "RESPEITA A BARBA",
            subheadline: "Estilo clássico para o homem moderno. Sem frescura.",
            primaryColor: "#FF4D00",
        }
    },
    "skin-premium": {
        id: "skin-premium",
        name: "Skin Premium",
        category: "medical",
        desc: "Médico e confiável. Azul sereno com branco puro.",
        layout: "clean-clinic",
        defaults: {
            headline: "Especialistas em Dermatologia Estética",
            subheadline: "Saúde e beleza unidas pela ciência e tecnologia.",
            primaryColor: "#0284C7",
        }
    },
    "fitness-studio": {
        id: "fitness-studio",
        name: "Fitness Studio",
        category: "fitness",
        desc: "Energético e motivador. Vermelho energia com preto.",
        layout: "modern-studio",
        defaults: {
            headline: "SEM DESCULPAS",
            subheadline: "Treinamento focado no seu resultado.",
            primaryColor: "#DD1E22",
        }
    },
    "wellness-clinic": {
        id: "wellness-clinic",
        name: "Wellness Clinic",
        category: "wellness",
        desc: "Calmo e profissional. Roxo suave com lavanda.",
        layout: "clean-clinic",
        defaults: {
            headline: "Seu ponto de equilíbrio",
            subheadline: "Clínica de bem-estar com terapias especializadas.",
            primaryColor: "#7C3AED",
        }
    },
    "makeup-artist": {
        id: "makeup-artist",
        name: "Makeup Artist",
        category: "beauty",
        desc: "Glamouroso e criativo. Magenta com coral.",
        layout: "modern-studio",
        defaults: {
            headline: "A ARTE DA MAKE",
            subheadline: "Produções completas para casamentos e eventos.",
            primaryColor: "#E11D48",
        }
    },
    "manicure-pastel": {
        id: "manicure-pastel",
        name: "Manicure Pastel",
        category: "beauty",
        desc: "Delicado e feminino. Tons pastéis e fontes elegantes.",
        layout: "manicure-pastel",
        defaults: {
            headline: "Beleza que floresce em cada detalhe",
            subheadline: "Manicure russa e nail art minimalista.",
            primaryColor: "#F8E1E7",
        }
    },
    "barber-clean": {
        id: "barber-clean",
        name: "Barber Clean",
        category: "barber",
        desc: "Premium e industrial. Preto com detalhes em dourado.",
        layout: "barber-clean",
        defaults: {
            headline: "SHARP CUTS. BOLD MOVES.",
            subheadline: "The modern standard for the classic gentleman.",
            primaryColor: "#C5A059",
        }
    },
    "elegant-glow": {
        id: "elegant-glow",
        name: "Elegant Glow",
        category: "luxury",
        desc: "A estética definitiva. Glassmorphism e tipografia premium.",
        layout: "elegant-glow",
        defaults: {
            headline: "BELEZA QUE SE REVELA",
            subheadline: "Atendimento exclusivo em um ambiente planejado para o seu conforto.",
            primaryColor: "#9E7B9B",
        }
    }
};

/**
 * TECHNICAL LAYOUTS mapping.
 * In a real Next.js app, these would be components imported and mapped.
 */
export const TEMPLATE_LAYOUTS = {
    "beauty-soft": "BeautySoft", // Layout component name
    "premium-dark": "PremiumDark",
    "clean-clinic": "CleanClinic",
    "modern-studio": "ModernStudio",
    "manicure-pastel": "ManicurePastel",
    "barber-clean": "BarberClean",
    "elegant-glow": "ElegantGlow",
};
