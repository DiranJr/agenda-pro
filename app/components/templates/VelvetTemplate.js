"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ServiceSection, GallerySection, StaffSection, FooterSection } from "../public/Sections";
import { cn } from "@/lib/utils";

export default function VelvetTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
    return (
        <div className={cn(tokens.page, "min-h-screen")}>
            {/* Elegant Hero with Background Image if available */}
            <header className="relative py-32 px-10 overflow-hidden bg-zinc-950 text-white">
                {customization.heroImageUrl && (
                    <div className="absolute inset-0 opacity-40">
                        <Image src={customization.heroImageUrl} fill className="object-cover" alt="Hero" unoptimized />
                    </div>
                )}
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-start text-left">
                    {customization.logoUrl && (
                        <div className="w-20 h-20 mb-10 overflow-hidden border border-white/20" style={{ borderRadius: radius }}>
                            <Image src={customization.logoUrl} fill className="object-cover" alt="Logo" unoptimized />
                        </div>
                    )}
                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-7xl font-serif italic mb-6 leading-[1]"
                    >
                        {customization.heroTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl opacity-70 max-w-lg mb-10"
                    >
                        {customization.heroSubtitle}
                    </motion.p>
                    <button
                        onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                        style={{ borderRadius: radius }}
                    >
                        Ver Serviços
                    </button>
                </div>
            </header>

            <main id="services" className="max-w-5xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ServiceSection
                                    services={services}
                                    onSelect={(s) => { setStep(2); booking.service = s; }}
                                    showPrices={showPrices}
                                    radius={radius}
                                    tokens={tokens}
                                    isMobile={isMobile}
                                />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <StaffSection
                                    staff={staff}
                                    booking={booking}
                                    onSelect={(st) => { setStep(3); booking.staff = st; }}
                                    radius={radius}
                                    tokens={tokens}
                                    primaryColor={primaryColor}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-12">
                    <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />

                    <div className="p-10 bg-zinc-50 border border-zinc-100 space-y-4" style={{ borderRadius: radius }}>
                        <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Informações</h3>
                        <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                            {tenant.name} oferece os melhores procedimentos com profissionais qualificados. Agende agora e viva uma experiência exclusiva.
                        </p>
                        {customization.whatsapp && (
                            <a href={`https://wa.me/${customization.whatsapp}`} className="block text-sm font-black text-indigo-600 hover:scale-105 transition-transform origin-left">
                                Dúvidas? Fale conosco no WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </main>

            <FooterSection tenantName={tenant.name} tokens={tokens} />
        </div>
    );
}
