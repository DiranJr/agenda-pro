"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Instagram,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    Star,
    Heart,
    Sparkles,
    Calendar as CalendarIcon,
    User,
    Scissors,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

/**
 * ElegantGlow Layout - A high-end, aesthetic template for beauty and aesthetics.
 * Features glassmorphism, smooth transitions, and premium typography.
 */
export default function ElegantGlow({ tenant, services, staff, booking, step, setStep, isMobile, website }) {
    const { content, flags, style } = website;
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slots, setSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    const primaryColor = style?.primaryColor || "#9E7B9B";

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

            if (res.ok) {
                setStep(5);
                toast.success("Seu momento foi reservado!");
            } else {
                const err = await res.json();
                toast.error(err.error || "Houve um problema ao reservar");
            }
        } catch (e) {
            toast.error("Erro na conexão");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDFE] text-zinc-900 font-sans selection:bg-pink-100">
            {/* Elegant Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {content.logoUrl && (
                            <img src={content.logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                        )}
                        <span className="text-xl font-black uppercase tracking-widest text-zinc-900">{content.brandName || tenant.name}</span>
                    </div>
                    <button
                        onClick={() => document.getElementById('booking-view').scrollIntoView({ behavior: 'smooth' })}
                        className="px-6 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-zinc-200"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Agendar Agora
                    </button>
                </div>
            </nav>

            {/* Premium Hero Section */}
            <header className="relative pt-32 pb-40 lg:pt-48 lg:pb-64 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <img
                        src={content.heroImageUrl || "/images/placeholders/manicure-hero.jpg"}
                        alt="Hero"
                        className="w-full h-full object-cover opacity-10 blur-[80px] scale-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-zinc-100 rounded-full text-zinc-400 text-[10px] font-black uppercase tracking-widest shadow-sm"
                    >
                        <Sparkles className="w-3 h-3 text-amber-400" /> Experiência Exclusiva
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 leading-[0.85]"
                    >
                        {content.headline || "Beleza que se revela."}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium"
                    >
                        {content.subheadline || "Cuidado premium e atendimento personalizado em um ambiente sofisticado."}
                    </motion.p>
                </div>

                {/* Floating Gallery Elements */}
                {content.galleryUrls?.length > 0 && (
                    <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-30 select-none pointer-events-none hidden lg:block">
                        <div className="flex gap-10 whitespace-nowrap animate-marquee">
                            {[...content.galleryUrls, ...content.galleryUrls].map((url, i) => (
                                <img key={i} src={url} className="h-48 w-48 object-cover rounded-[3rem] shadow-xl grayscale hover:grayscale-0 transition-all" />
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Booking Core Interaction */}
            <main id="booking-view" className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-40">

                {/* Left Side: Services & Info */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl p-8 lg:p-12">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                                        <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Escolha o Serviço</h2>
                                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                                            <Scissors className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service, i) => (
                                            <button
                                                key={service.id}
                                                onClick={() => { booking.service = service; setStep(2); }}
                                                className="group p-6 rounded-[2rem] bg-zinc-50 hover:bg-white border-2 border-transparent hover:border-zinc-900 transition-all text-left space-y-4"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-black text-zinc-800 uppercase leading-none">{service.name}</h3>
                                                    {flags.showPrices && (
                                                        <span className="text-sm font-black text-zinc-900">R$ {service.price}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-400 font-medium line-clamp-2">{service.description || "Um toque de luxo para completar seu visual."}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 pt-2">
                                                    <Clock className="w-3 h-3" /> {service.duration} MIN
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setStep(1)} className="p-3 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Profissional</h2>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Passo 2 de 4</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {staff.map((member) => (
                                            <button
                                                key={member.id}
                                                onClick={() => { booking.staff = member; setStep(3); }}
                                                className="group relative p-8 rounded-[2.5rem] bg-zinc-50 hover:bg-white border-2 border-transparent hover:border-zinc-900 transition-all flex flex-col items-center text-center space-y-4"
                                            >
                                                <div className="w-24 h-24 rounded-[2rem] bg-zinc-200 overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=f4f4f5&color=a1a1aa`} alt={member.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{member.name}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">{member.role || "Especialista"}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setStep(2)} className="p-3 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Sua Agenda</h2>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Passo 3 de 4</span>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-4">Data Preferida</label>
                                            <input
                                                type="date"
                                                value={booking.date}
                                                onChange={(e) => { booking.date = e.target.value; setStep(3); }}
                                                className="w-full p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] font-black text-xl text-center outline-none focus:bg-white focus:border-zinc-900 transition-all select-none appearance-none"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                            {loadingSlots ? (
                                                Array(12).fill(0).map((_, i) => (
                                                    <div key={i} className="h-14 bg-zinc-50 animate-pulse rounded-2xl" />
                                                ))
                                            ) : slots.length === 0 ? (
                                                <div className="col-span-full py-12 text-center bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                                                    <CalendarIcon className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhum horário disponível nesta data</p>
                                                </div>
                                            ) : slots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => { booking.time = time; setStep(4); }}
                                                    className="h-14 flex items-center justify-center rounded-2xl bg-zinc-50 hover:bg-zinc-900 hover:text-white font-black transition-all shadow-sm border border-white"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setStep(3)} className="p-3 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Sua Identidade</h2>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Final</span>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Nome Completo</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] font-bold outline-none focus:bg-white focus:border-zinc-900 transition-all"
                                                    placeholder="Como prefere ser chamada?"
                                                    value={booking.customerName}
                                                    onChange={e => booking.customerName = e.target.value}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">WhatsApp</label>
                                                <input
                                                    type="tel"
                                                    className="w-full p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] font-bold outline-none focus:bg-white focus:border-zinc-900 transition-all"
                                                    placeholder="(00) 00000-0000"
                                                    value={booking.customerPhone}
                                                    onChange={e => booking.customerPhone = e.target.value}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleConfirmBooking}
                                            disabled={bookingLoading}
                                            className="w-full py-8 bg-zinc-900 text-white rounded-full text-lg font-black uppercase tracking-[0.3em] shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-4"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {bookingLoading ? (
                                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Confirmar Agora <CheckCircle2 className="w-6 h-6" /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 space-y-8"
                                >
                                    <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto text-green-500 shadow-xl shadow-green-100">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-zinc-900 uppercase">Tudo Pronto!</h2>
                                        <p className="text-zinc-500 font-medium max-w-xs mx-auto text-lg">Seu agendamento foi confirmado com sucesso. Te esperamos em breve!</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-10 py-5 bg-zinc-900 text-white rounded-full font-black uppercase tracking-widest text-xs"
                                    >
                                        Voltar ao Início
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side: Floating Summary Card */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 bg-zinc-900 text-white rounded-[3rem] p-10 space-y-10 shadow-2xl shadow-zinc-900/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                            <Sparkles className="w-32 h-32" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resumo da Visita</h3>
                            <p className="text-2xl font-black">{tenant.name}</p>
                        </div>

                        <div className="space-y-6">
                            <SummaryRow icon={Scissors} label="Serviço" value={booking.service?.name || "A definir"} />
                            <SummaryRow icon={User} label="Com" value={booking.staff?.name || "Qualquer Especialista"} />
                            <SummaryRow icon={CalendarIcon} label="Data" value={booking.date || "A selecionar"} />
                            <SummaryRow icon={Clock} label="Horário" value={booking.time ? `${booking.time} HRS` : "Horário a selecionar"} />
                        </div>

                        {booking.service && flags.showPrices && (
                            <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Estimado</p>
                                    <p className="text-3xl font-black tracking-tight">R$ {booking.service.price}</p>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg opacity-60">Pagar no local</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="bg-zinc-50 py-32 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20">
                    <div className="space-y-8">
                        <h4 className="text-2xl font-black uppercase tracking-widest">{tenant.name}</h4>
                        <p className="text-zinc-400 font-medium leading-relaxed">Excelência em cada detalhe. O seu espaço exclusivo de autocuidado e alta performance estética.</p>
                        <div className="flex gap-4">
                            <SocialIcon icon={Instagram} />
                            <SocialIcon icon={Phone} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Onde estamos</h5>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-300">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <p className="text-zinc-600 font-bold leading-relaxed">{tenant.address || "Av. Principal, 1000 - Centro, São Paulo"}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Atendimento</h5>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-300">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="text-zinc-600 font-bold">
                                <p>Seg à Sex: 09h às 20h</p>
                                <p>Sábado: 09h às 16h</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-32 border-t border-zinc-100 flex flex-col md:row items-center justify-between gap-6 opacity-30 grayscale saturate-0 pointer-events-none">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">Antigravity Engine · AgendaPro SaaS Platform</span>
                </div>
            </footer>
        </div>
    );
}

function SummaryRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">{label}</p>
                <p className="text-sm font-bold tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function SocialIcon({ icon: Icon }) {
    return (
        <button className="w-12 h-12 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
            <Icon className="w-5 h-5" />
        </button>
    );
}
