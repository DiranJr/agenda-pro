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

export default function CleanClinic({ tenant, services, staff, booking, step, setStep, isMobile, website }) {
    const { content, flags, style } = website;
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    const tokens = {
        page: 'bg-[#F8FAFC] text-[#0F172A] font-sans',
        header: 'bg-white pt-20 pb-16 px-6 text-center border-b border-slate-100',
        logoBox: 'bg-[#E0F2FE] text-[#0284C7] shadow-sm',
        title: 'text-[#0F172A] font-semibold tracking-tight',
        subtitle: 'text-slate-500',
        card: 'bg-white border border-slate-200 text-[#0F172A] hover:border-[#0284C7]/30 hover:shadow-xl hover:shadow-slate-200/50',
        serviceName: 'text-[#0F172A] font-bold text-base',
        price: 'text-[#0369A1]',
        meta: 'text-slate-400',
        input: 'bg-slate-50 border-slate-200 text-[#0F172A] placeholder-slate-400 focus:bg-white focus:border-[#0284C7]',
        slotBtn: 'bg-white text-slate-600 border-slate-200 hover:bg-[#0284C7] hover:text-white',
        cta: 'bg-[#0284C7] text-white hover:bg-[#0369A1]',
        badge: 'bg-[#0284C7]/10 text-[#0284C7] text-[10px] font-bold',
        backBtn: 'bg-slate-50 text-slate-400 border border-slate-200',
        summaryCard: 'bg-slate-50 border-slate-200',
        footer: 'text-slate-300',
        label: 'text-slate-400',
    };

    const radius = "0.5rem";

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
                    slug: tenant.slug, serviceId: booking.service.id, staffId: booking.staff.id,
                    date: booking.date, time: booking.time,
                    customer: { name: booking.customerName, phone: booking.customerPhone.replace(/\D/g, "") }
                })
            });
            if (res.ok) { setStep(5); toast.success("Confirmado!"); }
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
                        <button onClick={() => setStep(s => s - 1)} className="p-2 border border-slate-200 rounded-lg shrink-0"><ChevronLeft className="w-4 h-4" /></button>
                        <StepBadge active={step >= 1} label="Procedimento" />
                        <StepBadge active={step >= 2} label="Especialista" />
                        <StepBadge active={step >= 3} label="Horário" />
                        <StepBadge active={step >= 4} label="Finalizar" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
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
                        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <input type="date" value={booking.date} onChange={e => { booking.date = e.target.value; setStep(3); }} className="w-full p-4 border border-slate-200 rounded-lg text-center outline-none focus:ring-2 ring-[#0284C7]/20" min={new Date().toISOString().split('T')[0]} />
                            <SlotSection slots={slots} loading={loadingSlots} onSelect={t => { booking.time = t; setStep(4); }} tokens={tokens} radius={radius} />
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
                                <SummaryItem label="Procedimento" value={booking.service?.name} />
                                <SummaryItem label="Especialista" value={booking.staff?.name} />
                                <SummaryItem label="Horário" value={`${booking.date} - ${booking.time}`} />
                            </div>
                            <div className="space-y-4">
                                <Input label="NOME COMPLETO" value={booking.customerName} onChange={e => booking.customerName = e.target.value} />
                                <Input label="WHATSAPP" value={booking.customerPhone} onChange={e => booking.customerPhone = e.target.value} />
                                <Button onClick={handleConfirmBooking} className="w-full h-14 rounded-lg font-bold" style={{ backgroundColor: style.primaryColor }} loading={bookingLoading}>Agendar Consulta</Button>
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
    return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shrink-0", active ? "bg-[#0284C7] text-white" : "bg-white text-slate-400 border border-slate-100 uppercase")}>{label}</span>;
}

function SummaryItem({ label, value }) {
    return <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span><span className="text-xs font-bold text-[#0F172A]">{value}</span></div>;
}
