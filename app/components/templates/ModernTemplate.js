"use client";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection, ServiceSection, GallerySection, StaffSection, FooterSection } from "../public/Sections";
import { cn } from "@/lib/utils";

export default function ModernTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
    return (
        <div className={cn(tokens.page, "min-h-screen")}>
            <header className="bg-white border-b border-zinc-100 py-12 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    {customization.logoUrl && (
                        <div className="w-20 h-20 relative overflow-hidden" style={{ borderRadius: radius }}>
                            <img src={customization.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                        </div>
                    )}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{customization.heroTitle}</h1>
                        <p className="text-zinc-500 mt-2">{customization.heroSubtitle}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-16 py-16">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                            <ServiceSection
                                services={services}
                                onSelect={(s) => { setStep(2); booking.service = s; }}
                                showPrices={showPrices}
                                radius={radius}
                                tokens={tokens}
                                isMobile={isMobile}
                            />
                            <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />
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
            </main>

            <FooterSection tenantName={tenant.name} tokens={tokens} />
        </div>
    );
}
