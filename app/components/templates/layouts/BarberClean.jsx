"use client";
import React from 'react';
import {
    Instagram,
    MapPin,
    Phone,
    Clock,
    Scissors,
    Zap,
    Star,
    ShieldCheck,
    Award,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BarberClean({ tenant, onBooking }) {
    const { websiteConfig, services = [], staff = [] } = tenant;
    const { hero = {}, gallery = [] } = websiteConfig || {};

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 font-sans selection:bg-[#C5A059] selection:text-black">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
                    <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
                        <Scissors className="w-8 h-8 text-[#C5A059]" />
                        {tenant.name.toUpperCase()}
                    </div>
                    <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                        <a href="#inicio" className="hover:text-[#C5A059] transition-colors">Origins</a>
                        <a href="#servicos" className="hover:text-[#C5A059] transition-colors">Services</a>
                        <a href="#especialistas" className="hover:text-[#C5A059] transition-colors">Cutting Crew</a>
                        <button
                            onClick={onBooking}
                            className="bg-[#C5A059] text-black px-8 py-3 rounded-none hover:bg-white transition-all font-black"
                        >
                            BOOK NOW
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section id="inicio" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero.image || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"}
                        className="w-full h-full object-cover opacity-20 grayscale"
                        alt="Hero BG"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl space-y-10"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em]">
                            <ShieldCheck className="w-4 h-4" /> Established 2024
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter italic">
                            {hero.title || "SHARP CUTS. BOLD MOVES."}
                        </h1>
                        <p className="text-xl text-zinc-500 font-medium max-w-xl leading-relaxed border-l-4 border-[#C5A059] pl-8">
                            {hero.subtitle || "The modern standard for the classic gentleman. Excellence in every stroke, precision in every fade."}
                        </p>
                        <div className="pt-6 flex flex-col md:flex-row gap-6">
                            <button
                                onClick={onBooking}
                                className="px-14 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all flex items-center justify-center gap-4"
                            >
                                SECURE APPOINTMENT
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button className="px-14 py-6 border border-zinc-800 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">
                                VIEW LOOKBOOK
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Line */}
            <div className="bg-[#C5A059] py-10">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
                    {[
                        { val: '15k+', label: 'Cortes Realizados' },
                        { val: '10+', label: 'Especialistas' },
                        { val: '4.9', label: 'Avaliação Google' },
                        { val: '100%', label: 'Satisfação' },
                    ].map((s, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="text-4xl font-black text-black leading-none">{s.val}</div>
                            <div className="text-[10px] font-black text-black/60 uppercase tracking-widest mt-2">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Menu */}
            <section id="servicos" className="py-32 px-8">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">The Menu</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">PREMIUM SERVICES</h2>
                        </div>
                        <p className="text-zinc-500 max-w-xs text-sm font-medium uppercase tracking-widest leading-loose">
                            Custom-tailored experience for every client. We don't just cut hair, we craft your identity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ backgroundColor: '#111' }}
                                className="bg-[#0A0A0A] p-12 flex items-center justify-between group transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#C5A059] font-black text-xs italic">0{i + 1}.</span>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">{service.name}</h3>
                                    </div>
                                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest max-w-sm line-clamp-1">{service.description || "O corte clássico definitivo para quem não aceita menos que a perfeição."}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-700">
                                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {service.duration} MIN</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span className="text-[#C5A059]">TOP RATED</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="text-3xl font-black text-white italic tracking-tighter">R$ {service.price}</div>
                                    <button onClick={onBooking} className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Lookbook */}
            <section className="py-32 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gallery.length > 0 ? gallery.map((img, i) => (
                        <div key={i} className={cn(
                            "relative group overflow-hidden bg-black aspect-square",
                            i === 0 ? "md:col-span-2 md:row-span-2 aspect-video" : ""
                        )}>
                            <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                    )) : (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center p-10 text-center">
                                <Scissors className="w-10 h-10 text-zinc-800" />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-zinc-900 bg-black">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-20">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="text-4xl font-black text-white italic tracking-tighter">{tenant.name.toUpperCase()}</div>
                        <p className="text-zinc-500 max-w-sm text-sm font-medium leading-loose">
                            We believe that grooming is a lifestyle. Our mission is to provide an unmatched experience where craft meets community.
                        </p>
                        <div className="flex gap-6">
                            <button className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all">
                                <Instagram className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">Location</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-xs font-bold text-zinc-400">
                                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0" />
                                <p>{tenant.address || "123 Victory Blvd, Downtown"}</p>
                            </div>
                            <div className="flex items-start gap-4 text-xs font-bold text-zinc-400">
                                <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                                <p>{tenant.phone || "(00) 00000-0000"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">Hours</h4>
                        <div className="space-y-2 text-xs font-bold text-zinc-400">
                            <div className="flex justify-between border-b border-zinc-900 pb-2">
                                <span>MON - FRI</span>
                                <span className="text-white">09:00 - 20:00</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900 pb-2">
                                <span>SATURDAY</span>
                                <span className="text-white">09:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>SUNDAY</span>
                                <span>CLOSED</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 pt-24 text-center text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">
                    Copyright 2026 {tenant.name} &middot; Precision Engineering for Gentlemen
                </div>
            </footer>
        </div>
    );
}
