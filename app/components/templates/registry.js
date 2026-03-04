"use client";
import GlowTemplate from "./GlowTemplate";
import VelvetTemplate from "./VelvetTemplate";
import ModernTemplate from "./ModernTemplate";

export const TEMPLATE_LAYOUTS = {
    "lash-beauty": GlowTemplate,
    "dark-luxury": VelvetTemplate,
    "natural-spa": GlowTemplate,
    "urban-barber": VelvetTemplate,
    "skin-premium": ModernTemplate,
    "fitness-studio": ModernTemplate,
    "wellness-clinic": ModernTemplate,
    "makeup-artist": GlowTemplate,
};

export function getTemplateLayout(templateId) {
    return TEMPLATE_LAYOUTS[templateId] || GlowTemplate;
}
