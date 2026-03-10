"use client";
import BeautySoft from "./layouts/BeautySoft";
import PremiumDark from "./layouts/PremiumDark";
import CleanClinic from "./layouts/CleanClinic";
import ModernStudio from "./layouts/ModernStudio";
import { SITE_TEMPLATES } from "@/lib/siteTemplates";

/**
 * TECHNICAL_LAYOUT_COMPONENTS maps the technical layout ID to the React Component.
 */
export const TECHNICAL_LAYOUT_COMPONENTS = {
    "beauty-soft": BeautySoft,
    "premium-dark": PremiumDark,
    "clean-clinic": CleanClinic,
    "modern-studio": ModernStudio,
};

/**
 * Resolves the layout component for a given commercial template ID.
 */
export function getTemplateLayout(templateId) {
    const templateDef = SITE_TEMPLATES[templateId] || SITE_TEMPLATES["lash-beauty"];
    return TECHNICAL_LAYOUT_COMPONENTS[templateDef.layout] || BeautySoft;
}
