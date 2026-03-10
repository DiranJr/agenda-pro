"use client";
import BeautySoft from "@/app/components/templates/layouts/BeautySoft";
import PremiumDark from "@/app/components/templates/layouts/PremiumDark";
import CleanClinic from "@/app/components/templates/layouts/CleanClinic";
import ModernStudio from "@/app/components/templates/layouts/ModernStudio";
import { useState } from "react";
import { Button } from "@/app/components/ui/core";
import { Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DATA = {
    tenant: { name: "Studio Master", slug: "master" },
    services: [
        { id: '1', name: 'Corte Moderno', duration: 45, price: 80, imageUrl: null },
        { id: '2', name: 'Coloração Premium', duration: 120, price: 250, imageUrl: null }
    ],
    staff: [
        { id: '1', name: 'Adriana Silva', services: [{ serviceId: '1' }, { serviceId: '2' }] }
    ],
    website: {
        templateId: 'lash-beauty',
        content: {
            brandName: "Studio Master",
            headline: "Sua melhor versão começa aqui",
            subheadline: "Referência em cuidados capilares e estética avançada.",
            logoUrl: "",
            galleryUrls: [],
            whatsapp: "551199999999"
        },
        flags: { showPrices: true, showGallery: true, showStaff: true },
        style: { primaryColor: '#6366f1' }
    }
};

export default function PreviewAllPage() {
    const [viewMode, setViewMode] = useState('mobile');
    const [booking, setBooking] = useState({
        service: null, staff: null, date: '2026-12-31', time: '10:00',
        customerName: '', customerPhone: ''
    });
    const [step, setStep] = useState(1);

    const layouts = [
        { name: "Beauty Soft", Component: BeautySoft, color: "#FF1B6D" },
        { name: "Premium Dark", Component: PremiumDark, color: "#D4AF37" },
        { name: "Clean Clinic", Component: CleanClinic, color: "#0284C7" },
        { name: "Modern Studio", Component: ModernStudio, color: "#DD1E22" }
    ];

    return (
        <div className="min-h-screen bg-zinc-100 p-8">
            <header className="flex items-center justify-between mb-12 bg-white p-6 rounded-3xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 uppercase">Design System Preview</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Compare a consistência entre layouts</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl">
                    <button onClick={() => setViewMode('mobile')} className={cn("p-3 rounded-lg transition-all", viewMode === 'mobile' ? "bg-white shadow-sm text-indigo-600" : "text-zinc-400")}><Smartphone className="w-5 h-5" /></button>
                    <button onClick={() => setViewMode('desktop')} className={cn("p-3 rounded-lg transition-all", viewMode === 'desktop' ? "bg-white shadow-sm text-indigo-600" : "text-zinc-400")}><Monitor className="w-5 h-5" /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {layouts.map(({ name, Component, color }) => (
                    <div key={name} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                            <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tighter">{name}</h2>
                        </div>
                        <div className={cn(
                            "bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-zinc-900 relative transition-all duration-700 mx-auto",
                            viewMode === 'mobile' ? "w-[360px] h-[640px]" : "w-full h-[640px]"
                        )}>
                            <div className="w-full h-full overflow-y-auto no-scrollbar pointer-events-none opacity-90">
                                <Component
                                    tenant={MOCK_DATA.tenant}
                                    services={MOCK_DATA.services}
                                    staff={MOCK_DATA.staff}
                                    booking={booking}
                                    step={step}
                                    setStep={setStep}
                                    isMobile={viewMode === 'mobile'}
                                    website={{
                                        ...MOCK_DATA.website,
                                        style: { primaryColor: color }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
