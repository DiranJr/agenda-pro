"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

export default function ModernTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
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
            <header className="bg-white border-b border-zinc-100 py-12 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    {customization.logoUrl && (
                        <div className="w-20 h-20 relative overflow-hidden" style={{ borderRadius: radius }}>
                            <img src={customization.logoUrl} className="w-full h-full object-cover" alt="Logo" unoptimized />
                        </div>
                    )}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{customization.heroTitle}</h1>
                        <p className="text-zinc-500 mt-2 font-medium">{customization.heroSubtitle}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-16 py-16 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                            <ServiceSection services={services} onSelect={s => { booking.service = s; setStep(2); }} showPrices={showPrices} radius={radius} tokens={tokens} isMobile={isMobile} />
                            <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <StaffSection staff={staff} booking={booking} onSelect={st => { booking.staff = st; setStep(3); }} radius={radius} tokens={tokens} primaryColor={primaryColor} />
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <input type="date" value={booking.date} onChange={e => { booking.date = e.target.value; setStep(3); }} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl" min={new Date().toISOString().split('T')[0]} />
                            <SlotSection slots={slots} loading={loadingSlots} onSelect={t => { booking.time = t; setStep(4); }} tokens={tokens} radius={radius} />
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-8">
                            <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight italic">Confirme seus dados</h3>
                            <Input label="Seu Nome" value={booking.customerName} onChange={e => booking.customerName = e.target.value} error={formErrors.name} />
                            <Input label="WhatsApp" value={booking.customerPhone} onChange={e => booking.customerPhone = formatPhone(e.target.value)} error={formErrors.phone} placeholder="(00) 00000-0000" />
                            <Button onClick={handleConfirmBooking} className="w-full h-14 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl" loading={bookingLoading}>Finalizar Agendamento</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {step === 5 && <BookingConfirmationModal booking={booking} tenant={tenant} tokens={tokens} radius={radius} onDone={() => setStep(1)} />}
            </AnimatePresence>

            <FooterSection tenantName={tenant.name} tokens={tokens} />
        </div>
    );
}
