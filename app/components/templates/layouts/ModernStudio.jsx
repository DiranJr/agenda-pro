"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    HeroSection,
    ServiceSection,
    GallerySection,
    StaffSection,
    SlotSection,
    BookingConfirmationModal,
    FooterSection
} from "../../public/Sections";
import { Input } from "@/app/components/ui/forms";
import { Button } from "@/app/components/ui/core";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Scissors } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ModernStudio({ tenant, services, staff, booking, step, setStep, isMobile, website }) {
    const { content, flags, style } = website;
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    const tokens = {
        page: 'bg-black text-white font-sans',
        header: 'bg-black pt-24 pb-20 px-6 text-center relative overflow-hidden',
        logoBox: 'bg-[#DD1E22] text-white shadow-2xl rotate-3',
        title: 'text-white font-black italic uppercase text-5xl tracking-tighter',
        subtitle: 'text-zinc-400 font-medium tracking-widest',
        card: 'bg-[#111111] border-r-8 border-[#DD1E22] text-white hover:translate-x-2 transition-transform',
        serviceName: 'text-white font-black italic uppercase',
        price: 'text-[#DD1E22] font-black italic',
        meta: 'text-zinc-500',
        input: 'bg-[#111111] border-zinc-800 text-white placeholder-zinc-600 focus:border-[#DD1E22]',
        slotBtn: 'bg-[#111111] border border-zinc-700 text-white hover:bg-[#DD1E22]',
        cta: 'bg-[#DD1E22] text-white hover:opacity-90 font-black italic uppercase tracking-tighter',
        badge: 'bg-[#DD1E22] text-white text-[10px] font-black italic uppercase',
        backBtn: 'bg-zinc-800 text-zinc-400',
        summaryCard: 'bg-[#111111] border-zinc-800',
        footer: 'text-zinc-900',
        label: 'text-zinc-500',
    };

    const radius = "0.25rem";

    useEffect(() => {
        if (step === 3 && booking.service && booking.staff && booking.date) {
            setLoadingSlots(true);
            fetch(`/api/public/availability?slug=${tenant.slug}&staffId=${booking.staff.id}&serviceId=${booking.service.id}&date=${booking.date}`)
                .then(res => res.json())
                .then(data => { setSlots(data.slots || []); setLoadingSlots(false); })
                .catch(() => setLoadingSlots(false));
        }
    }, [step, booking.date, booking.service, booking.staff, tenant.slug]);

    const handleConfirmBooking = async () => {
        setBookingLoading(true);
        try {
            const res = await fetch("/api/public/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: tenant.slug, serviceId: booking.service.id, staffId: booking.staff.id,
                    date: booking.date, time: booking.time,
                    customer: { name: booking.customerName, phone: booking.customerPhone.replace(/\D/g, "") }
                })
            });
            if (res.ok) { setStep(5); toast.success("LET'S GO!"); }
            else { const err = await res.json(); toast.error(err.error || "Erro"); }
        } catch (e) { toast.error("Erro na conexão"); }
        finally { setBookingLoading(false); }
    };

    return (
        <div className={cn(tokens.page, "min-h-screen")}>
            <HeroSection title={content.headline} subtitle={content.subheadline} logoUrl={content.logoUrl} radius={radius} tokens={tokens} />

            <main className="max-w-xl mx-auto p-6 pb-32 space-y-12">
                {step > 1 && step < 5 && (
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar py-2">
                        <button onClick={() => setStep(s => s - 1)} className="p-3 bg-zinc-900 rounded-sm shrink-0"><ChevronLeft className="w-4 h-4 text-white" /></button>
                        <StepBadge active={step >= 1} label="Treino" />
                        <StepBadge active={step >= 2} label="Coach" />
                        <StepBadge active={step >= 3} label="Horário" />
                        <StepBadge active={step >= 4} label="GO!" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 text-center italic">
                            {flags.showGallery && <GallerySection gallery={content.galleryUrls} radius={radius} tokens={tokens} />}
                            <ServiceSection services={services} onSelect={s => { booking.service = s; setStep(2); }} showPrices={flags.showPrices} radius={radius} tokens={tokens} isMobile={isMobile} />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}>
                            <StaffSection staff={staff} booking={booking} onSelect={st => { booking.staff = st; setStep(3); }} radius={radius} tokens={tokens} primaryColor={style.primaryColor || '#DD1E22'} />
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <input type="date" value={booking.date} onChange={e => { booking.date = e.target.value; setStep(3); }} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-none text-white font-black italic outline-none focus:border-[#DD1E22]" min={new Date().toISOString().split('T')[0]} />
                            <SlotSection slots={slots} loading={loadingSlots} onSelect={t => { booking.time = t; setStep(4); }} tokens={tokens} radius={radius} />
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, rotate: -2 }} animate={{ opacity: 1, rotate: 0 }} className="space-y-8">
                            <div className="p-8 bg-[#111111] border-l-8 border-[#DD1E22] space-y-2 italic font-black uppercase">
                                <p className="text-zinc-500 text-xs">Resumo</p>
                                <p>{booking.service?.name}</p>
                                <p className="text-[#DD1E22]">{booking.staff?.name}</p>
                                <p className="text-sm">{booking.date} @ {booking.time}</p>
                            </div>
                            <div className="space-y-4 italic">
                                <Input label="SEU NOME" placeholder="EX: JOÃO SILVA" value={booking.customerName} onChange={e => booking.customerName = e.target.value} className="placeholder:opacity-20" />
                                <Input label="WHATSAPP" placeholder="99 99999-9999" value={booking.customerPhone} onChange={e => booking.customerPhone = e.target.value} className="placeholder:opacity-20" />
                                <Button onClick={handleConfirmBooking} className="w-full h-16 font-black text-xl italic skew-x-[-10deg] uppercase" style={{ backgroundColor: style.primaryColor || '#DD1E22' }} loading={bookingLoading}>Confirmar Agora</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <AnimatePresence>{step === 5 && <BookingConfirmationModal booking={booking} tenant={tenant} tokens={tokens} radius={radius} onDone={() => setStep(1)} />}</AnimatePresence>
            <FooterSection tenantName={content.brandName || tenant.name} tokens={tokens} />
        </div>
    );
}

function StepBadge({ active, label }) {
    return <span className={cn("text-[10px] font-black italic uppercase tracking-tighter px-4 py-2 shrink-0 skew-x-[-10deg]", active ? "bg-[#DD1E22] text-white" : "bg-zinc-900 text-zinc-600")}>{label}</span>;
}
