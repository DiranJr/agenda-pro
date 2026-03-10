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

export default function PremiumDark({ tenant, services, staff, booking, step, setStep, isMobile, website }) {
    const { content, flags, style } = website;
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    const tokens = {
        page: 'bg-[#0A0A0A] text-white font-sans',
        header: 'bg-[#0A0A0A] pt-24 pb-20 px-6 text-center border-b border-white/5',
        logoBox: 'bg-[#141414] border border-white/10 shadow-2xl',
        title: 'text-white font-black tracking-tighter uppercase',
        subtitle: 'text-zinc-500 font-medium',
        card: 'bg-[#141414] border border-white/5 text-white hover:border-white/20 transition-all',
        serviceName: 'text-white font-black uppercase tracking-wider',
        price: 'text-white font-black',
        meta: 'text-zinc-600',
        input: 'bg-[#141414] border-white/10 text-white placeholder-zinc-600 focus:border-white',
        slotBtn: 'bg-[#141414] border-white/10 text-white hover:bg-white hover:text-black',
        cta: 'bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest',
        badge: 'bg-white/5 text-zinc-400 text-[9px] font-bold border border-white/10',
        backBtn: 'bg-white/5 text-zinc-500 hover:text-white',
        summaryCard: 'bg-[#141414] border-white/10',
        footer: 'text-zinc-800',
        label: 'text-zinc-500',
    };

    const radius = "0.75rem";

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

    const handleConfirmBooking = async () => {
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
            if (res.ok) { setStep(5); toast.success("Agendamento realizado!"); }
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
                        <button onClick={() => setStep(s => s - 1)} className="p-2 bg-white/5 border border-white/10 rounded-lg shrink-0"><ChevronLeft className="w-4 h-4 text-white" /></button>
                        <StepBadge active={step >= 1} label="Serviço" />
                        <StepBadge active={step >= 2} label="Profissional" />
                        <StepBadge active={step >= 3} label="Horário" />
                        <StepBadge active={step >= 4} label="Dados" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            {flags.showGallery && <GallerySection gallery={content.galleryUrls} radius={radius} tokens={tokens} />}
                            <ServiceSection services={services} onSelect={s => { booking.service = s; setStep(2); }} showPrices={flags.showPrices} radius={radius} tokens={tokens} isMobile={isMobile} />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <StaffSection staff={staff} booking={booking} onSelect={st => { booking.staff = st; setStep(3); }} radius={radius} tokens={tokens} primaryColor={style.primaryColor} />
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <input type="date" value={booking.date} onChange={e => { booking.date = e.target.value; setStep(3); }} className="w-full p-5 bg-[#141414] border border-white/5 rounded-xl font-bold text-center outline-none focus:border-white/20" min={new Date().toISOString().split('T')[0]} />
                            <SlotSection slots={slots} loading={loadingSlots} onSelect={t => { booking.time = t; setStep(4); }} tokens={tokens} radius={radius} />
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                            <div className="p-8 bg-[#141414] border border-white/10 rounded-2xl items-center flex flex-wrap justify-center gap-4">
                                <SummaryItem icon={Scissors} label={booking.service?.name} />
                                <SummaryItem icon={User} label={booking.staff?.name} />
                                <SummaryItem icon={CalendarIcon} label={`${booking.date} às ${booking.time}`} />
                            </div>
                            <div className="space-y-4">
                                <Input label="NOME" placeholder="Seu nome" value={booking.customerName} onChange={e => booking.customerName = e.target.value} className="bg-[#141414] border-white/10 text-white" />
                                <Input label="WHATSAPP" placeholder="(00) 00000-0000" value={booking.customerPhone} onChange={e => booking.customerPhone = e.target.value} className="bg-[#141414] border-white/10 text-white" />
                                <Button onClick={handleConfirmBooking} className="w-full h-16 rounded-xl font-black uppercase tracking-[0.2em]" style={{ backgroundColor: style.primaryColor, color: '#000' }} loading={bookingLoading}>Agendar Agora</Button>
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
    return <span className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shrink-0", active ? "bg-white text-black" : "bg-white/5 text-zinc-600 border border-white/5")}>{label}</span>;
}

function SummaryItem({ icon: Icon, label }) {
    return <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5"><Icon className="w-3" /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>;
}
