"use client";
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { getTenantWebsite } from '@/lib/getTenantWebsite';
import { getTemplateLayout } from '@/app/components/templates/registry';

export default function PublicHomeUI({ tenant, services, staff }) {
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    // 1. Get consolidated config with fallbacks
    const baseWebsite = getTenantWebsite(tenant);

    // 2. Merge with Preview Overrides if applicable
    const website = {
        ...baseWebsite,
        templateId: (isPreview && searchParams.get('template')) || baseWebsite.templateId,
        content: {
            ...baseWebsite.content,
            headline: (isPreview && searchParams.get('title')) || baseWebsite.content.headline,
            subheadline: (isPreview && searchParams.get('sub')) || baseWebsite.content.subheadline,
            logoUrl: (isPreview && searchParams.get('logo')) || baseWebsite.content.logoUrl,
            heroImageUrl: (isPreview && searchParams.get('banner')) || baseWebsite.content.heroImageUrl,
        },
        flags: {
            ...baseWebsite.flags,
            showPrices: (isPreview && searchParams.get('showPrices')) ? searchParams.get('showPrices') === 'true' : baseWebsite.flags.showPrices,
        }
    };

    // Re-resolve layout if template changed in preview
    const LayoutComponent = getTemplateLayout(website.templateId);

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
                website={website}
            />

        </>
    );
}
