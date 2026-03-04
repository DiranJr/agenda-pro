"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

export function FooterSection({ tenantName, tokens }) {
    return (
        <footer className={cn("p-12 text-center space-y-4 border-t border-white/5 bg-black/5", tokens.footer)}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 {tenantName}</span>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF1B6D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF1B6D] animate-pulse" />
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
