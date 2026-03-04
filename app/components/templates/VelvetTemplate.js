"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    ServiceSection,
    GallerySection,
    StaffSection,
    SlotSection,
    BookingConfirmationModal,
    FooterSection
} from "../public/Sections";
import { Input } from "@/app/components/ui/forms";
import { Button } from "@/app/components/ui/core";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function VelvetTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (step === 3 && booking.service && booking.staff && booking.date) {
            setLoadingSlots(true);
            fetch(`/api/public/availability?slug=${tenant.slug}&staffId=${booking.staff.id}&serviceId=${booking.service.id}&date=${booking.date}`)
                .then(res => res.json())
                .then(data => {
                    setSlots(data.slots || []);
                    setLoadingSlots(false);
                })
                .catch(() => setLoadingSlots(false));
        }
    }, [step, booking.date, booking.service, booking.staff, tenant.slug]);

    const formatPhone = (val) => {
        let cleaned = val.replace(/\D/g, "");
        if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    };

    const handleConfirmBooking = async () => {
        if (booking.customerName.length < 3) return setFormErrors({ name: "Nome muito curto" });
        if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(booking.customerPhone)) return setFormErrors({ phone: "Telefone inválido" });

        setBookingLoading(true);
        try {
            const res = await fetch("/api/public/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: tenant.slug,
                    serviceId: booking.service.id,
                    staffId: booking.staff.id,
                    date: booking.date,
                    time: booking.time,
                    customer: {
                        name: booking.customerName,
                        phone: booking.customerPhone.replace(/\D/g, ""),
                    }
                })
            });

            if (res.ok) setStep(5);
            else toast.error("Erro ao agendar");
        } catch (e) {
            toast.error("Erro na conexão");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className={cn(tokens.page, "min-h-screen")}>
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
                        Agendar Agora
                    </button>
                </div>
            </header>

            <main id="services" className="max-w-6xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ServiceSection
                                    services={services}
                                    onSelect={(s) => { booking.service = s; setStep(2); }}
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
                                    onSelect={(st) => { booking.staff = st; setStep(3); }}
                                    radius={radius}
                                    tokens={tokens}
                                    primaryColor={primaryColor}
                                />
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                <input
                                    type="date"
                                    value={booking.date}
                                    onChange={(e) => { booking.date = e.target.value; setStep(3); }}
                                    className="w-full p-5 bg-white border border-zinc-100 rounded-2xl font-black text-center"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <SlotSection slots={slots} loading={loadingSlots} onSelect={(t) => { booking.time = t; setStep(4); }} tokens={tokens} radius={radius} />
                            </motion.div>
                        )}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <h3 className="text-2xl font-serif italic text-zinc-900 border-b pb-4">Seus Dados</h3>
                                <Input label="Nome" value={booking.customerName} onChange={e => booking.customerName = e.target.value} error={formErrors.name} />
                                <Input label="WhatsApp" value={booking.customerPhone} onChange={e => booking.customerPhone = formatPhone(e.target.value)} error={formErrors.phone} placeholder="(00) 00000-0000" />
                                <Button onClick={handleConfirmBooking} className="w-full h-16 bg-zinc-950 text-white rounded-none italic font-serif text-lg" loading={bookingLoading}>Confirmar Reserva</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-12">
                    <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />
                    <div className="p-10 bg-zinc-50 border border-zinc-100 space-y-4" style={{ borderRadius: radius }}>
                        <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Informações</h3>
                        <p className="text-sm font-medium text-zinc-600 leading-relaxed">{tenant.name} oferece uma experiência exclusiva.</p>
                        {customization.whatsapp && <a href={`https://wa.me/${customization.whatsapp}`} className="block text-sm font-black text-zinc-900 underline underline-offset-4">Falar no WhatsApp</a>}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {step === 5 && <BookingConfirmationModal booking={booking} tenant={tenant} tokens={tokens} radius={radius} onDone={() => setStep(1)} />}
            </AnimatePresence>

            <FooterSection tenantName={tenant.name} tokens={tokens} />
        </div>
    );
}
