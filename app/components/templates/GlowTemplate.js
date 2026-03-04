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
} from "../public/Sections";
import { Input } from "@/app/components/ui/forms";
import { Button } from "@/app/components/ui/core";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Scissors } from "lucide-react";
import { toast } from "react-hot-toast";

export default function GlowTemplate({ tenant, services, staff, booking, step, setStep, isMobile, customization, tokens, radius, primaryColor, showPrices }) {
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Fetch availability when service, staff, and date are selected
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

    const validateForm = () => {
        const errors = {};
        if (booking.customerName.length < 3) errors.name = "Nome muito curto (min 3 letras)";
        if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(booking.customerPhone)) errors.phone = "Telefone inválido";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const formatPhone = (val) => {
        let cleaned = val.replace(/\D/g, "");
        if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    };

    const handleConfirmBooking = async () => {
        if (!validateForm()) return;

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

            if (res.ok) {
                setStep(5); // Show confirmation modal
                toast.success("Agendamento realizado!");
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao agendar");
            }
        } catch (e) {
            toast.error("Erro na conexão");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className={cn(tokens.page, "min-h-screen")}>
            <HeroSection
                title={customization.heroTitle}
                subtitle={customization.heroSubtitle}
                logoUrl={customization.logoUrl}
                radius={radius}
                tokens={tokens}
            />

            <main className="max-w-xl mx-auto p-6 pb-32 space-y-12">
                {/* Navigation Breadcrumb */}
                {step > 1 && step < 5 && (
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar py-2">
                        <button onClick={() => setStep(s => s - 1)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-all mr-2">
                            <ChevronLeft className="w-4 h-4 text-zinc-600" />
                        </button>
                        <StepBadge active={step >= 1} label="Serviço" />
                        <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
                        <StepBadge active={step >= 2} label="Profissional" />
                        <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
                        <StepBadge active={step >= 3} label="Horário" />
                        <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
                        <StepBadge active={step >= 4} label="Dados" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <GallerySection gallery={customization.galleryUrls} radius={radius} tokens={tokens} />
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
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest text-center block">Selecione a Data</label>
                                <input
                                    type="date"
                                    value={booking.date}
                                    onChange={(e) => { booking.date = e.target.value; setStep(3); }} // Trigger re-render
                                    className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-center outline-none focus:border-zinc-900 transition-all"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <SlotSection
                                slots={slots}
                                loading={loadingSlots}
                                onSelect={(time) => { booking.time = time; setStep(4); }}
                                tokens={tokens}
                                radius={radius}
                            />
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-zinc-900 uppercase">Resumo da Reserva</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <SummaryItem icon={Scissors} label={booking.service?.name} />
                                    <SummaryItem icon={User} label={booking.staff?.name} />
                                    <SummaryItem icon={CalendarIcon} label={`${booking.date} às ${booking.time}`} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Seu Nome Completo"
                                    placeholder="Como prefere ser chamado?"
                                    value={booking.customerName}
                                    onChange={e => { booking.customerName = e.target.value; setFormErrors({ ...formErrors, name: '' }); }}
                                    error={formErrors.name}
                                />
                                <Input
                                    label="Seu WhatsApp"
                                    placeholder="(00) 00000-0000"
                                    value={booking.customerPhone}
                                    onChange={e => { booking.customerPhone = formatPhone(e.target.value); setFormErrors({ ...formErrors, phone: '' }); }}
                                    error={formErrors.phone}
                                />

                                <Button
                                    onClick={handleConfirmBooking}
                                    className="w-full h-16 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest shadow-2xl mt-6"
                                    loading={bookingLoading}
                                >
                                    Confirmar Agendamento
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {step === 5 && (
                    <BookingConfirmationModal
                        booking={booking}
                        tenant={tenant}
                        tokens={tokens}
                        radius={radius}
                        onDone={() => setStep(1)}
                    />
                )}
            </AnimatePresence>

            <FooterSection tenantName={tenant.name} tokens={tokens} />
        </div>
    );
}

function StepBadge({ active, label }) {
    return (
        <span className={cn(
            "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0",
            active ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
        )}>
            {label}
        </span>
    );
}

function SummaryItem({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-100">
            <Icon className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{label}</span>
        </div>
    );
}
