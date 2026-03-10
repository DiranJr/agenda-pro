"use client";
import { useEffect, useState } from "react";
import {
    Palette,
    ImageIcon,
    Check,
    Smartphone,
    ExternalLink,
    ChevronRight,
    Plus,
    Trash2,
    CheckCircle2,
    Settings,
    ArrowRight,
    ArrowLeft,
    MonitorIcon,
    SmartphoneIcon,
    Zap,
    Users,
    Layout,
    Type,
    MessageCircle,
    Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { ImageUploader } from "@/app/components/ui/uploader";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SITE_TEMPLATES } from "@/lib/siteTemplates";
import Image from "next/image";

export default function WebsiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [previewMode, setPreviewMode] = useState('mobile');
    const [lastPublished, setLastPublished] = useState(null);

    const [config, setConfig] = useState({
        templateId: 'lash-beauty',
        content: {
            brandName: '',
            headline: '',
            subheadline: '',
            logoUrl: '',
            heroImageUrl: '',
            whatsapp: '',
            instagram: '',
            address: '',
            galleryUrls: [],
        },
        flags: {
            showPrices: true,
            showGallery: true,
            showStaff: true,
            showAddress: true,
        },
        style: {
            primaryColor: '#FF1B6D',
        },
        slug: ''
    });

    useEffect(() => {
        fetch('/api/crm/website')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    const tenant = data.tenant;
                    // O GET da API já devolve a estrutura consolidada via getTenantWebsite
                    if (tenant.website) {
                        setConfig(prev => ({
                            ...tenant.website,
                            slug: tenant.slug
                        }));
                    }
                    if (tenant.publishedAt) {
                        setLastPublished(new Date(tenant.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleContentChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            content: { ...prev.content, [key]: value }
        }));
    };

    const handleFlagChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            flags: { ...prev.flags, [key]: value }
        }));
    };

    const handleStyleChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            style: { ...prev.style, [key]: value }
        }));
    };

    const handleSelectTemplate = (tmp) => {
        setConfig(prev => ({
            ...prev,
            templateId: tmp.id,
            content: {
                ...prev.content,
                headline: prev.content.headline || tmp.defaults.headline,
                subheadline: prev.content.subheadline || tmp.defaults.subheadline,
            },
            style: {
                ...prev.style,
                primaryColor: tmp.defaults.primaryColor
            }
        }));
        toast.success(`Estilo ${tmp.name} selecionado!`);
        setCurrentStep(2);
    };

    const handleSave = async (publish = true) => {
        setSaving(true);
        const res = await fetch('/api/crm/website', {
            method: 'PATCH',
            body: JSON.stringify({
                ...config,
                isPublished: publish
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success(publish ? "Seu site está no ar!" : "Configurações salvas!");
            if (publish) {
                setLastPublished(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                setCurrentStep(4);
            }
        } else {
            toast.error("Erro ao salvar configurações.");
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-50 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">Abrindo Estúdio Visual...</p>
        </div>
    );

    const steps = [
        { id: 1, label: 'Template', icon: Palette },
        { id: 2, label: 'Conteúdo', icon: Type },
        { id: 3, label: 'Mídias', icon: ImageIcon },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-6 lg:-m-12 overflow-hidden bg-zinc-50 font-sans">
            <div className="flex-1 flex flex-col min-w-[500px] border-r border-zinc-200 bg-white shadow-xl relative z-20">
                <div className="px-10 py-8 border-b border-zinc-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Seu Site Profissional</h2>
                            <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">Configure seu cartão de visitas digital.</p>
                        </div>
                        <Badge variant="indigo" className="py-1 px-3">Wizard v2.0</Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <button onClick={() => setCurrentStep(step.id)} className={cn("flex-1 flex flex-col gap-2 transition-all", currentStep >= step.id ? "opacity-100" : "opacity-30")}>
                                    <div className={cn("h-1.5 rounded-full transition-all duration-500", currentStep >= step.id ? "bg-indigo-600" : "bg-zinc-100")} />
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center transition-all", currentStep === step.id ? "bg-indigo-600 text-white" : currentStep > step.id ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400")}>
                                            {currentStep > step.id ? <Check className="w-3 h-3" /> : <step.icon className="w-3 h-3" />}
                                        </div>
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest", currentStep === step.id ? "text-indigo-600" : "text-zinc-400")}>{step.label}</span>
                                    </div>
                                </button>
                                {idx < steps.length - 1 && <div className="w-4 h-px bg-zinc-100 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="s1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">ESCOLHA SEU TEMPLATE</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.values(SITE_TEMPLATES).map(tmp => (
                                        <button key={tmp.id} onClick={() => handleSelectTemplate(tmp)} className={cn("p-6 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all group relative overflow-hidden", config.templateId === tmp.id ? "bg-white border-indigo-600 shadow-xl" : "bg-zinc-50 border-transparent hover:border-zinc-200")}>
                                            <div className="w-24 h-24 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-2xl uppercase" style={{ color: tmp.defaults.primaryColor }}>{tmp.name[0]}</div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{tmp.category}</span>
                                                <h4 className="text-xl font-black text-zinc-900 leading-tight mb-2 mt-1">{tmp.name}</h4>
                                                <p className="text-xs font-medium text-zinc-500 leading-relaxed">{tmp.desc}</p>
                                            </div>
                                            <ChevronRight className={cn("w-6 h-6 transition-all", config.templateId === tmp.id ? "text-indigo-600" : "text-zinc-200")} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">O QUE SEU CLIENTE VAI LER?</h3>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <Input
                                            label="Nome da Marca"
                                            value={config.content.brandName}
                                            onChange={e => handleContentChange('brandName', e.target.value.slice(0, 30))}
                                            placeholder="Ex: Studio Glow"
                                        />
                                        <p className="text-[9px] font-bold text-zinc-400 text-right uppercase">{config.content.brandName?.length || 0}/30</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            label="Título Chamativo (Headline)"
                                            value={config.content.headline}
                                            onChange={e => handleContentChange('headline', e.target.value.slice(0, 60))}
                                            placeholder="Ex: Realce sua beleza natural"
                                        />
                                        <p className="text-[9px] font-bold text-zinc-400 text-right uppercase">{config.content.headline?.length || 0}/60</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            label="Subtítulo Descritivo"
                                            value={config.content.subheadline}
                                            onChange={e => handleContentChange('subheadline', e.target.value.slice(0, 140))}
                                            placeholder="Ex: Agende seu horário com especialistas em estética facial."
                                        />
                                        <p className="text-[9px] font-bold text-zinc-400 text-right uppercase">{config.content.subheadline?.length || 0}/140</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="WhatsApp" value={config.content.whatsapp} onChange={e => handleContentChange('whatsapp', e.target.value)} />
                                        <Input label="Instagram" value={config.content.instagram} onChange={e => handleContentChange('instagram', e.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mostrar Preços no Site?</span>
                                        <button onClick={() => handleFlagChange('showPrices', !config.flags.showPrices)} className={cn("w-12 h-6 rounded-full transition-all relative", config.flags.showPrices ? "bg-indigo-600" : "bg-zinc-200")}>
                                            <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", config.flags.showPrices ? "left-7" : "left-1")} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block">Cor Principal</label>
                                        <div className="flex items-center gap-4">
                                            <input type="color" value={config.style.primaryColor} onChange={e => handleStyleChange('primaryColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer overflow-hidden border-none p-0" />
                                            <span className="text-sm font-mono font-bold text-zinc-900 uppercase">{config.style.primaryColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">LOGO E GALERIA</h3>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sua Logo</label>
                                    <ImageUploader onUpload={(url) => handleContentChange('logoUrl', url)} label="Subir Logo" />
                                    {config.content.logoUrl && <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-100 group"><Image src={config.content.logoUrl} fill className="object-cover" alt="Logo" unoptimized /><button onClick={() => handleContentChange('logoUrl', '')} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 className="w-4 h-4 text-white" /></button></div>}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Fotos dos Seus Trabalhos</label>
                                        <span className="text-[10px] font-black text-zinc-300 uppercase">{config.content.galleryUrls?.length || 0}/8</span>
                                    </div>
                                    {config.content.galleryUrls?.length < 8 ? (
                                        <ImageUploader onUpload={(url) => handleContentChange('galleryUrls', [...config.content.galleryUrls, url])} label="Adicionar à Galeria" />
                                    ) : (
                                        <div className="p-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Limite de 8 fotos atingido</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-3">
                                        {config.content.galleryUrls.map((url, i) => (
                                            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-zinc-100"><Image src={url} fill className="object-cover" alt="G" unoptimized /><button onClick={() => handleContentChange('galleryUrls', config.content.galleryUrls.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 className="w-5 h-5 text-white" /></button></div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div key="s4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-10">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100"><CheckCircle2 className="w-12 h-12" /></div>
                                <div><h3 className="text-3xl font-black text-zinc-900 tracking-tight">VAI PRO AR!</h3><p className="text-zinc-500 font-medium mt-3 max-w-sm mx-auto">Seu site profissional está pronto para converter visitantes em clientes.</p></div>
                                <Card padding="p-8" className="bg-zinc-900 text-white max-w-sm mx-auto space-y-4 border-none shadow-2xl rounded-[2.5rem]">
                                    <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">LINK DO SEU SITE</div>
                                    <div className="text-xl font-mono tracking-tight font-black">agendapro.com/{config.slug}</div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <Button onClick={() => window.open(`/${config.slug}`, '_blank')} className="w-full bg-white text-black hover:bg-zinc-100 h-14 rounded-2xl"><ExternalLink className="w-4 h-4 mr-2" /> Visualizar</Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-10 border-t border-zinc-100 bg-white flex items-center justify-between">
                    <button onClick={() => currentStep > 1 && setCurrentStep(s => s - 1)} className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all", currentStep === 1 && "opacity-0 pointer-events-none")}><ArrowLeft className="w-3 h-3" /> Voltar</button>
                    {currentStep < 4 ? <Button onClick={currentStep === 3 ? () => handleSave(true) : () => setCurrentStep(s => s + 1)} className="px-12 h-16 rounded-2xl shadow-xl text-sm font-black uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 text-white" loading={saving}>{currentStep === 3 ? "PUBLICAR AGORA" : "PRÓXIMO PASSO"} <ArrowRight className="w-4 h-4 ml-2" /></Button> : <Button onClick={() => handleSave(true)} className="px-12 h-16 rounded-2xl bg-indigo-600 text-white font-black" loading={saving}>ATUALIZAR SITE</Button>}
                </div>
            </div>

            {/* Preview Panel */}
            <div className="w-[500px] h-full hidden lg:flex flex-col bg-[#F8F9FC] p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Live Preview</h3></div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-zinc-100">
                        <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><SmartphoneIcon className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><MonitorIcon className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className={cn("bg-[#0F172A] rounded-[3rem] shadow-2xl transition-all duration-700 overflow-hidden border-[10px] border-[#1E293B] relative", previewMode === 'mobile' ? "w-[300px] h-[600px]" : "w-full h-full max-h-[550px]")}>
                        <iframe src={`/${config.slug}?preview=true&template=${config.templateId}&title=${encodeURIComponent(config.content.headline)}&sub=${encodeURIComponent(config.content.subheadline)}&logo=${encodeURIComponent(config.content.logoUrl)}&banner=${encodeURIComponent(config.content.heroImageUrl)}&showPrices=${config.flags.showPrices}`} className="w-full h-full border-none pt-4 bg-white" key={JSON.stringify(config)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
