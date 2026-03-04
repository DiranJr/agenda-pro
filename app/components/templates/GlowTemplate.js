"use client";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection, ServiceSection, GallerySection, StaffSection, FooterSection } from "../public/Sections";
import { cn } from "@/lib/utils";

export default function GlowTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
    return (
        <div className={cn(tokens.page, "min-h-screen")}>
            <HeroSection
                title={customization.heroTitle}
                subtitle={customization.heroSubtitle}
                logoUrl={customization.logoUrl}
                radius={radius}
                tokens={tokens}
            />

            <main className="max-w-2xl mx-auto p-6 space-y-12">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />
                            <div className="h-12" />
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
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
