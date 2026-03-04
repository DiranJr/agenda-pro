"use client";
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { SITE_TEMPLATES } from '@/lib/siteTemplates';
import { getTemplateLayout } from '@/app/components/templates/registry';

export default function PublicHomeUI({ tenant, services, staff }) {
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    // Live preview overrides
    const previewTemplate = searchParams.get('template');
    const previewTitle = searchParams.get('title');
    const previewSub = searchParams.get('sub');
    const previewLogo = searchParams.get('logo');
    const previewBanner = searchParams.get('banner');
    const previewShowPrices = searchParams.get('showPrices');

    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({
        service: null,
        staff: null,
        date: DateTime.now().plus({ days: 1 }).toISODate(),
        time: null,
        customerName: '',
        customerPhone: '',
    });

    const [bookingDone, setBookingDone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeTemplateId = (isPreview && previewTemplate) ? previewTemplate : (tenant.templateId || 'lash-beauty');
    const currentTemplate = SITE_TEMPLATES[activeTemplateId] || SITE_TEMPLATES['lash-beauty'];

    const customization = tenant.customization || {};
    const displayTitle = (isPreview && previewTitle) ? previewTitle : (customization.heroTitle || currentTemplate.defaults.heroTitle);
    const displaySub = (isPreview && previewSub) ? previewSub : (customization.heroSubtitle || currentTemplate.defaults.heroSubtitle);
    const displayLogo = (isPreview && previewLogo) ? previewLogo : customization.logoUrl;
    const showPrices = (isPreview && previewShowPrices) ? previewShowPrices === 'true' : (customization.showPrices !== false);

    const mergedCustomization = {
        ...customization,
        heroTitle: displayTitle,
        heroSubtitle: displaySub,
        logoUrl: displayLogo,
        heroImageUrl: (isPreview && previewBanner) ? previewBanner : customization.heroImageUrl,
        showPrices: showPrices
    };

    const primaryColor = currentTemplate.defaults.primaryColor;
    const radius = currentTemplate.defaults.borderRadius;
    const tokens = currentTemplate.tokens;

    const LayoutComponent = getTemplateLayout(activeTemplateId);

    return (
        <>
            <LayoutComponent
                tenant={tenant}
                services={services}
                staff={staff}
                booking={booking}
                step={step}
                setStep={setStep}
                isMobile={isMobile}
                customization={mergedCustomization}
                tokens={tokens}
                radius={radius}
                primaryColor={primaryColor}
                showPrices={showPrices}
            />

        </>
    );
}
