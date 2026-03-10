import { SITE_TEMPLATES } from "./siteTemplates";

/**
 * Consolidates tenant website data using the new structure with fallbacks for legacy fields.
 * @param {Object} tenant The tenant object from DB
 * @returns {Object} { templateId, content, flags, style }
 */
export function getTenantWebsite(tenant) {
    if (!tenant) return null;

    // 1. Get base templateId
    const website = tenant.website || {};
    const templateId = website.templateId || tenant.templateId || "lash-beauty";
    const templateDef = SITE_TEMPLATES[templateId] || SITE_TEMPLATES["lash-beauty"];

    // 2. Consolidate Content (Legacy -> New)
    const legacyCustom = tenant.customization || {};

    const content = {
        brandName: website.content?.brandName || tenant.name || "",
        headline: website.content?.headline || legacyCustom.heroTitle || templateDef.defaults.headline,
        subheadline: website.content?.subheadline || legacyCustom.heroSubtitle || templateDef.defaults.subheadline,
        logoUrl: website.content?.logoUrl || legacyCustom.logoUrl || "",
        heroImageUrl: website.content?.heroImageUrl || legacyCustom.heroImageUrl || "",
        galleryUrls: website.content?.galleryUrls || legacyCustom.galleryUrls || [],
        whatsapp: website.content?.whatsapp || legacyCustom.whatsapp || "",
        instagram: website.content?.instagram || "",
        address: website.content?.address || "",
    };

    // 3. Flags (Visibility)
    const flags = {
        showPrices: website.flags?.hasOwnProperty('showPrices') ? website.flags.showPrices : (legacyCustom.showPrices !== undefined ? legacyCustom.showPrices : true),
        showGallery: website.flags?.hasOwnProperty('showGallery') ? website.flags.showGallery : true,
        showStaff: website.flags?.hasOwnProperty('showStaff') ? website.flags.showStaff : true,
        showAddress: website.flags?.hasOwnProperty('showAddress') ? website.flags.showAddress : true,
    };

    // 4. Style (Visual)
    const style = {
        primaryColor: website.style?.primaryColor || legacyCustom.primaryColor || templateDef.defaults.primaryColor,
    };

    return {
        templateId,
        content,
        flags,
        style,
        layout: templateDef.layout,
        templateName: templateDef.name
    };
}
