"use client";
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

import { SITE_TEMPLATES, getColorTokens } from '@/lib/siteTemplates';

export default function PublicHomeUI({ tenant, services, staff }) {
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    // Live preview overrides
    const previewTemplate = searchParams.get('template');
    const previewTitle = searchParams.get('title');
    const previewSub = searchParams.get('sub');
    const previewLogo = searchParams.get('logo');
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

    const activeTemplateId = (isPreview && previewTemplate) ? previewTemplate : (tenant.templateId || 'lash-beauty');
    const currentTemplate = SITE_TEMPLATES[activeTemplateId] || SITE_TEMPLATES['lash-beauty'];

    const customization = tenant.customization || {};
    const displayTitle = (isPreview && previewTitle) ? previewTitle : (customization.heroTitle || currentTemplate.defaults.heroTitle);
    const displaySub = (isPreview && previewSub) ? previewSub : (customization.heroSubtitle || currentTemplate.defaults.heroSubtitle);
    const displayLogo = (isPreview && previewLogo) ? previewLogo : customization.logoUrl;
    const showPrices = (isPreview && previewShowPrices) ? previewShowPrices === 'true' : (customization.showPrices !== false);
    const gallery = customization.galleryUrls || [];

    const primaryColor = currentTemplate.defaults.primaryColor;
    const secondaryColor = currentTemplate.defaults.secondaryColor;
    const radius = currentTemplate.defaults.borderRadius;
    const t = currentTemplate.tokens;

    return (
        <div className={cn(t.page, "min-h-screen")}>
            {/* Template Specific Background Decorations */}
            {t.headerGlow && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }} />
                </div>
            )}

            {/* Header / Hero Section */}
            <header className={cn(t.header, "animate-in fade-in duration-1000")}>
                <div className="relative z-10 max-w-xl mx-auto">
                    {displayLogo && (
                        <div
                            className={cn("w-24 h-24 mx-auto mb-10 overflow-hidden border-4 border-white/10 shadow-2xl transition-transform hover:scale-105", t.logoBox)}
                            style={{ borderRadius: radius }}
                        >
                            <img src={displayLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    )}
                    {!displayLogo && (
                        <div
                            className={cn("w-20 h-20 mx-auto mb-10 flex items-center justify-center font-black text-2xl border-2", t.logoBox)}
                            style={{ borderRadius: radius }}
                        >
                            {tenant.name[0]}
                        </div>
                    )}
                    <h1 className={cn("text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1] animate-in slide-in-from-top-8 duration-700", t.title)}>
                        {displayTitle}
                    </h1>
                    <p className={cn("text-base md:text-lg max-w-sm mx-auto opacity-70 font-medium animate-in slide-in-from-top-12 duration-1000", t.subtitle)}>
                        {displaySub}
                    </p>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6 space-y-20 pb-40 relative z-10">

                {/* Step 1: Services & Gallery */}
                {step === 1 && (
                    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Gallery Section */}
                        {gallery.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className={cn("text-xs font-black uppercase tracking-[0.3em] opacity-40", t.label)}>Galeria</h2>
                                    <div className="h-px flex-1 bg-current opacity-5 ml-4" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {gallery.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-sm hover:scale-[1.03] transition-transform duration-500 cursor-zoom-in" style={{ borderRadius: radius }}>
                                            <img src={url} alt="Trabalho" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Services List */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className={cn("text-xs font-black uppercase tracking-[0.3em] opacity-40", t.label)}>Nossos Serviços</h2>
                                <div className="h-px flex-1 bg-current opacity-5 ml-4" />
                            </div>
                            <div className="grid gap-3">
                                {services.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => { setBooking({ ...booking, service: s }); setStep(2); }}
                                        className={cn("p-6 text-left flex items-center gap-5 group transition-all duration-300", t.card)}
                                        style={{ borderRadius: radius }}
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 shrink-0 flex items-center justify-center border border-white/10" style={{ borderRadius: radius }}>
                                            {s.imageUrl ? (
                                                <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <span className="text-xl">✨</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={cn("font-black text-base uppercase tracking-tight mb-1", t.serviceName)}>{s.name}</h3>
                                            <div className="flex items-center gap-4">
                                                <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40", t.meta)}>{s.duration} min</span>
                                                {showPrices && (
                                                    <span className={cn("font-black text-sm", t.price)}>R$ {parseFloat(s.price).toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Step 2: Staff */}
                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className={cn("p-4 rounded-full transition-all", t.backBtn)}>
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className={cn("text-xs font-black uppercase tracking-[0.3em] opacity-40", t.label)}>Com quem?</h2>
                        </div>
                        <div className="grid gap-4">
                            {staff.filter(st => !booking.service || st.services.some(s => s.serviceId === booking.service.id)).map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => { setBooking({ ...booking, staff: st }); setStep(3); }}
                                    className={cn("p-6 text-left flex items-center gap-5 transition-all group", t.card)}
                                    style={{ borderRadius: radius }}
                                >
                                    <div
                                        className="w-16 h-16 flex-shrink-0 flex items-center justify-center font-black text-xl shadow-lg"
                                        style={{ borderRadius: radius, background: primaryColor, color: 'white' }}
                                    >
                                        {st.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-black text-base uppercase tracking-tight", t.serviceName)}>{st.name}</h3>
                                        <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1", t.meta)}>{st.location?.name || 'Unidade Principal'}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Calendar/Time - Skipping implementation for brevity but keeping structure */}
                {step === 3 && (
                    <div className="text-center py-20 space-y-6">
                        <div className="flex items-center gap-4 mb-10">
                            <button onClick={() => setStep(2)} className={cn("p-4 rounded-full transition-all", t.backBtn)}>
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className={cn("text-xs font-black uppercase tracking-[0.3em] opacity-40", t.label)}>Horário</h2>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/5 rounded-3xl" style={{ borderRadius: radius }}>
                            <p className="text-lg font-medium opacity-60">Implementação do Calendário V2 (Calendário Luxon) virá na próxima fase.</p>
                            <Button onClick={() => setStep(1)} className="mt-6" variant="primary">Voltar ao Início</Button>
                        </div>
                    </div>
                )}

            </main>

            <footer className={cn("p-10 text-center space-y-4 border-t border-white/5", t.footer)}>
                <div className="flex items-center justify-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 {tenant.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF1B6D]">Powered by Agenda Pro</span>
                </div>
            </footer>
        </div>
    );
}

function ChevronRight(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    );
}

function ArrowLeft(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
    );
}
