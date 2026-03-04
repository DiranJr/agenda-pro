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

            {/* Success Modal */}
            <AnimatePresence>
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-green-500" />
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Agendamento Realizado!</h3>
                            <p className="text-zinc-500 font-medium mt-4">
                                Sua reserva para <strong>{booking.service?.name}</strong> com <strong>{booking.staff?.name}</strong> foi confirmada.
                            </p>
                            <button
                                onClick={() => { setStep(1); setBookingDone(false); }}
                                className="w-full mt-10 h-14 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                            >
                                Voltar ao Início
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
