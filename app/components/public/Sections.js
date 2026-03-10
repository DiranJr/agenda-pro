"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Calendar, MessageSquare, CheckCircle, Clock, User, Scissors } from "lucide-react";

export function HeroSection({ title, subtitle, logoUrl, radius, tokens }) {
    return (
        <header className={cn(tokens.header, "relative pt-20 pb-10 px-6 text-center")}>
            <div className="relative z-10 max-w-xl mx-auto">
                {logoUrl && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn("w-24 h-24 mx-auto mb-8 overflow-hidden border-4 border-white/10 shadow-2xl relative", tokens.logoBox)}
                        style={{ borderRadius: radius }}
                    >
                        <Image src={logoUrl} alt="Logo" fill className="object-cover" unoptimized />
                    </motion.div>
                )}

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn("text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight", tokens.title)}
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={cn("text-sm md:text-lg max-w-sm mx-auto opacity-60 font-medium", tokens.subtitle)}
                >
                    {subtitle}
                </motion.p>
            </div>
        </header>
    );
}

export function ServiceSection({ services, onSelect, showPrices, radius, tokens, isMobile }) {
    if (!services || services.length === 0) {
        return (
            <div className="p-12 text-center bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhum serviço disponível no momento.</p>
            </div>
        );
    }
    return (
        <section className="space-y-6" role="region" aria-label="Lista de Serviços">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center", tokens.label)}>Nossos Serviços</h2>
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                {services.map(s => (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s)}
                        className={cn("p-5 text-left flex items-center gap-5 transition-all group relative overflow-hidden", tokens.card)}
                        style={{ borderRadius: radius }}
                    >
                        <div className="w-14 h-14 relative rounded-2xl overflow-hidden shrink-0 border border-white/10" style={{ borderRadius: radius }}>
                            {s.imageUrl ? (
                                <Image src={s.imageUrl} alt={s.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 font-black text-xl">✨</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={cn("font-black text-sm md:text-base uppercase tracking-tight mb-1", tokens.serviceName)}>{s.name}</h3>
                            <div className="flex items-center gap-4">
                                <span className={cn("text-[9px] font-bold uppercase tracking-widest opacity-40", tokens.meta)}>{s.duration} min</span>
                                {showPrices && (
                                    <span className={cn("font-black text-xs md:text-sm", tokens.price)}>R$ {parseFloat(s.price).toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                ))}
            </div>
        </section>
    );
}

export function GallerySection({ gallery, radius, tokens }) {
    if (!gallery || gallery.length === 0) return null;
    return (
        <section className="space-y-6">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center", tokens.label)}>Galeria</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {gallery.map((url, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square relative overflow-hidden shadow-sm"
                        style={{ borderRadius: radius }}
                    >
                        <Image src={url} alt="Gallery" fill className="object-cover" loading="lazy" unoptimized />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export function StaffSection({ staff, booking, onSelect, radius, tokens, primaryColor }) {
    const filteredStaff = staff.filter(st => !booking.service || st.services.some(s => s.serviceId === booking.service.id));

    if (filteredStaff.length === 0) {
        return (
            <div className="p-12 text-center bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhum profissional disponível para este serviço.</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center", tokens.label)}>Escolha o Profissional</h2>
            <div className="grid gap-4">
                {filteredStaff.map(st => (
                    <button
                        key={st.id}
                        onClick={() => onSelect(st)}
                        className={cn("p-5 text-left flex items-center gap-5 transition-all group", tokens.card)}
                        style={{ borderRadius: radius }}
                    >
                        <div
                            className="w-14 h-14 flex-shrink-0 flex items-center justify-center font-black text-lg shadow-sm"
                            style={{ borderRadius: radius, backgroundColor: primaryColor, color: 'white' }}
                        >
                            {st.name[0]}
                        </div>
                        <div className="flex-1">
                            <h3 className={cn("font-black text-sm uppercase tracking-tight", tokens.serviceName)}>{st.name}</h3>
                            <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1", tokens.meta)}>{st.location?.name || 'Unidade Principal'}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </section>
    );
}

export function SlotSection({ slots, loading, onSelect, tokens, radius }) {
    return (
        <section className="space-y-6">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center", tokens.label)}>Horários Disponíveis</h2>

            {loading ? (
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                        <div key={i} className="h-14 bg-zinc-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : slots && slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                    {slots.map(slot => (
                        <button
                            key={slot}
                            onClick={() => onSelect(slot)}
                            className={cn("h-14 flex items-center justify-center text-sm font-black transition-all", tokens.slotBtn)}
                            style={{ borderRadius: radius }}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-10 text-center bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhum horário disponível para este dia.</p>
                </div>
            )}
        </section>
    );
}

export function BookingConfirmationModal({ booking, tenant, onDone, tokens, radius }) {
    const handleGoogleCalendar = () => {
        const start = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00Z`;
        const end = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00Z`; // Simple end time for now
        const text = encodeURIComponent(`Agendamento: ${booking.service.name} - ${tenant.name}`);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=Profissional: ${booking.staff.name}`;
        window.open(url, '_blank');
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Olá! Gostaria de confirmar meu agendamento:\n\n✨ *Serviço:* ${booking.service.name}\n👤 *Profissional:* ${booking.staff.name}\n📅 *Data:* ${booking.date}\n⏰ *Horário:* ${booking.time}\n\nObrigado!`);
        window.open(`https://wa.me/${tenant.customization?.whatsapp || ''}?text=${message}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
            >
                <div className="absolute top-0 inset-x-0 h-2 bg-green-500" />

                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                    <CheckCircle className="w-10 h-10" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-2 border-green-500"
                    />
                </div>

                <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Tudo Pronto!</h3>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">Seu agendamento foi confirmado</p>

                <div className="mt-8 p-6 bg-zinc-50 rounded-3xl space-y-4 text-left border border-zinc-100">
                    <div className="flex items-center gap-4">
                        <Scissors className="w-4 h-4 text-zinc-400" />
                        <div>
                            <p className="text-[10px] uppercase font-black text-zinc-300 leading-none">Serviço</p>
                            <p className="text-sm font-black text-zinc-900 leading-tight">{booking.service?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <User className="w-4 h-4 text-zinc-400" />
                        <div>
                            <p className="text-[10px] uppercase font-black text-zinc-300 leading-none">Profissional</p>
                            <p className="text-sm font-black text-zinc-900 leading-tight">{booking.staff?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <div>
                            <p className="text-[10px] uppercase font-black text-zinc-300 leading-none">Data e Hora</p>
                            <p className="text-sm font-black text-zinc-900 leading-tight">{booking.date} às {booking.time}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <button
                        onClick={handleGoogleCalendar}
                        className="w-full h-14 bg-white border-2 border-zinc-100 text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
                    >
                        <Calendar className="w-4 h-4" /> Adicionar ao Google
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-green-100"
                    >
                        <MessageSquare className="w-4 h-4" /> Compartilhar WhatsApp
                    </button>
                    <button
                        onClick={onDone}
                        className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all mt-4"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function FooterSection({ tenantName, tokens }) {
    return (
        <footer className={cn("p-12 text-center space-y-4 border-t border-white/5 bg-black/5", tokens.footer)}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 {tenantName}</span>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Powered by Agenda Pro
                </span>
            </div>
        </footer>
    );
}

function ChevronRight(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    );
}
