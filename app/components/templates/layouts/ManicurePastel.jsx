"use client";
import React from 'react';
import {
    Instagram,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    Star,
    Heart,
    Scissors,
    Sparkles,
    Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ManicurePastel({ tenant, onBooking }) {
    const { websiteConfig, services = [], staff = [] } = tenant;
    const { hero = {}, gallery = [] } = websiteConfig || {};

    const colors = {
        primary: "#F8E1E7", // Soft Pink
        secondary: "#9E7B9B", // Muted Lavender
        accent: "#FFFFFF",
        text: "#4A4A4A"
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#4A4A4A] font-light selection:bg-[#F8E1E7]">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#F8E1E7]">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-serif italic text-[#9E7B9B]">{tenant.name}</div>
                    <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7B9B]">
                        <a href="#inicio" className="hover:opacity-60 transition-opacity">Início</a>
                        <a href="#servicos" className="hover:opacity-60 transition-opacity">Serviços</a>
                        <a href="#galeria" className="hover:opacity-60 transition-opacity">Galeria</a>
                        <Button onClick={onBooking} className="bg-[#9E7B9B] hover:bg-[#8A6A87] text-white rounded-full px-6 py-2">Agendar</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="inicio" className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8E1E7] rounded-full text-[#9E7B9B] text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Bem-vinda ao seu momento
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif italic text-[#9E7B9B] leading-[0.9]">
                            {hero.title || "Beleza que floresce em cada detalhe"}
                        </h1>
                        <p className="text-lg text-[#7A7A7A] max-w-md font-medium leading-relaxed">
                            {hero.subtitle || "Especialistas em manicure russa, nail art minimalista e autocuidado premium."}
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={onBooking}
                                className="group relative px-10 py-6 bg-[#9E7B9B] text-white rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-[#9E7B9B]/20 hover:scale-105 transition-all"
                            >
                                Reservar meu Horário
                                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white">
                            <img src={hero.image || "/images/placeholders/manicure-hero.jpg"} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F8E1E7] rounded-full -z-10 animate-pulse" />
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#9E7B9B]/5 rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* Services */}
            <section id="servicos" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl md:text-5xl font-serif italic text-[#9E7B9B]">Nossos Mimos</h2>
                        <div className="w-20 h-0.5 bg-[#F8E1E7] mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-[3rem] border border-[#F8E1E7] hover:bg-[#F8E1E7]/20 transition-all cursor-pointer space-y-6"
                            >
                                <div className="w-16 h-16 rounded-[2rem] bg-[#F8E1E7] flex items-center justify-center text-[#9E7B9B]">
                                    <Heart className="w-6 h-6 fill-current" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-[#9E7B9B] uppercase tracking-tight">{service.name}</h3>
                                    <p className="text-xs text-[#7A7A7A] leading-relaxed">{service.description || "Um toque de sofisticação para suas mãos."}</p>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#BBA5B8]">Duração</p>
                                        <p className="text-sm font-bold text-[#9E7B9B]">{service.duration} min</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#BBA5B8]">Incríveis</p>
                                        <p className="text-2xl font-serif italic text-[#9E7B9B]">R$ {service.price}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section id="galeria" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {gallery.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="rounded-[2rem] overflow-hidden border-4 border-white shadow-lg"
                            >
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-auto" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-[#F8E1E7]/30 text-center px-6">
                <div className="max-w-3xl mx-auto space-y-10">
                    <Heart className="w-12 h-12 text-[#9E7B9B] mx-auto animate-bounce" />
                    <h2 className="text-5xl md:text-6xl font-serif italic text-[#9E7B9B]">Pronta para brilhar?</h2>
                    <p className="text-lg text-[#7A7A7A] font-medium leading-relaxed">
                        Reserve agora o seu horário e sinta a experiência de um cuidado verdadeiramente personalizado.
                    </p>
                    <Button
                        onClick={onBooking}
                        className="px-16 py-8 bg-[#9E7B9B] hover:bg-[#8A6A87] text-white rounded-full text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#9E7B9B]/30"
                    >
                        Agendar Minha Visita
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-white border-t border-[#F8E1E7]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif italic text-[#9E7B9B]">{tenant.name}</h3>
                        <p className="text-sm text-[#7A7A7A] leading-relaxed">Onde a beleza encontra o bem-estar em uma atmosfera acolhedora e elegante.</p>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full border border-[#F8E1E7] flex items-center justify-center text-[#9E7B9B] hover:bg-[#F8E1E7] transition-all">
                                <Instagram className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9E7B9B]">Localização</h4>
                        <div className="flex items-start gap-4 text-sm text-[#7A7A7A]">
                            <MapPin className="w-5 h-5 text-[#F8E1E7] shrink-0" />
                            <p>{tenant.address || "Av. das Flores, 123 - Centro"}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9E7B9B]">Contatos</h4>
                        <div className="flex items-start gap-4 text-sm text-[#7A7A7A]">
                            <Phone className="w-5 h-5 text-[#F8E1E7] shrink-0" />
                            <p>{tenant.phone || "(00) 00000-0000"}</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 pt-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#BBA5B8]">
                    &copy; 2026 {tenant.name} · AgendaPro Experience
                </div>
            </footer>
        </div>
    );
}

function Button({ children, className, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn("px-6 py-3 rounded-xl font-bold transition-all active:scale-95", className)}
        >
            {children}
        </button>
    );
}
