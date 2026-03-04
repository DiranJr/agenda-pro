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
    MessageCircle
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
    const [currentStep, setCurrentStep] = useState(1); // 1: Template, 2: Content, 3: Gallery, 4: Finish
    const [previewMode, setPreviewMode] = useState('mobile');
    const [hasChanges, setHasChanges] = useState(false);
    const [lastPublished, setLastPublished] = useState(null);

    const [config, setConfig] = useState({
        templateId: 'lash-beauty',
        customization: {
            heroTitle: '',
            heroSubtitle: '',
            logoUrl: '',
            heroImageUrl: '',
            whatsapp: '',
            showPrices: true,
            galleryUrls: [],
        },
        slug: ''
    });

    useEffect(() => {
        fetch('/api/crm/website')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    const tenant = data.tenant;
                    setConfig({
                        templateId: tenant.templateId || 'lash-beauty',
                        customization: tenant.customization || {
                            heroTitle: '',
                            heroSubtitle: '',
                            logoUrl: '',
                            heroImageUrl: '',
                            whatsapp: '',
                            showPrices: true,
                            galleryUrls: [],
                        },
                        slug: tenant.slug
                    });
                    if (tenant.publishedAt) {
                        setLastPublished(new Date(tenant.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (key, value) => {
        setHasChanges(true);
        setConfig(prev => ({
            ...prev,
            customization: { ...prev.customization, [key]: value }
        }));
    };

    const handleSelectTemplate = (tmp) => {
        setHasChanges(true);
        setConfig(prev => ({
            ...prev,
            templateId: tmp.id,
            customization: {
                ...prev.customization,
                heroTitle: prev.customization.heroTitle || tmp.defaults.heroTitle,
                heroSubtitle: prev.customization.heroSubtitle || tmp.defaults.heroSubtitle,
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
                templateId: config.templateId,
                customization: config.customization,
                isPublished: publish
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success(publish ? "Seu site está no ar!" : "Configurações salvas!");
            setHasChanges(false);
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
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Abrindo Estúdio Visual...</p>
        </div>
    );

    const steps = [
        { id: 1, label: 'Estilo', icon: Palette },
        { id: 2, label: 'Informações', icon: Type },
        { id: 3, label: 'Visual', icon: ImageIcon },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-6 lg:-m-12 overflow-hidden bg-zinc-50 font-sans">
            {/* Left Panel: Workflow */}
            <div className="flex-1 flex flex-col min-w-[500px] border-r border-zinc-200 bg-white shadow-xl relative z-20">
                {/* Wizard Header */}
                <div className="px-10 py-8 border-b border-zinc-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Setup do seu Site</h2>
                            <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">Siga os passos para o sucesso digital.</p>
                        </div>
                        <Badge variant="indigo" className="py-1 px-3">SaaS Nível 10</Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className={cn(
                                        "flex-1 flex flex-col gap-2 group transition-all",
                                        currentStep >= step.id ? "opacity-100" : "opacity-30"
                                    )}
                                >
                                    <div className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        currentStep >= step.id ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" : "bg-zinc-100"
                                    )} />
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                            currentStep === step.id ? "bg-indigo-600 text-white shadow-lg" :
                                                currentStep > step.id ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"
                                        )}>
                                            {currentStep > step.id ? <Check className="w-3 h-3" /> : <step.icon className="w-3 h-3" />}
                                        </div>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            currentStep === step.id ? "text-indigo-600" : "text-zinc-400"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                </button>
                                {idx < steps.length - 1 && <div className="w-4 h-px bg-zinc-100 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <AnimatePresence mode="wait">
                        {/* Passo 1: Templates */}
                        {currentStep === 1 && (
                            <motion.div key="s1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">QUAL O ESTILO DO SEU NEGÓCIO?</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.values(SITE_TEMPLATES).map(tmp => (
                                        <button
                                            key={tmp.id}
                                            onClick={() => handleSelectTemplate(tmp)}
                                            className={cn(
                                                "p-6 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all group relative overflow-hidden",
                                                config.templateId === tmp.id
                                                    ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100/50 scale-[1.01]"
                                                    : "bg-zinc-50 border-transparent hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="w-24 h-32 rounded-2xl shrink-0 overflow-hidden relative shadow-inner flex flex-col" style={{ backgroundColor: tmp.defaults.secondaryColor }}>
                                                <div className="p-3 flex justify-center"><div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: tmp.defaults.primaryColor }} /></div>
                                                <div className="px-3 space-y-2">
                                                    <div className="h-1.5 w-full rounded-full opacity-30" style={{ backgroundColor: tmp.defaults.primaryColor }} />
                                                    <div className="h-1.5 w-1/2 rounded-full opacity-10 bg-black/20" />
                                                </div>
                                                <div className="mt-auto p-3 space-y-1.5 opacity-40">
                                                    <div className="h-4 rounded-lg bg-white/50" />
                                                    <div className="h-4 rounded-lg bg-white/50" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{tmp.category}</span>
                                                <h4 className="text-xl font-black text-zinc-900 leading-tight mb-2 mt-1">{tmp.name}</h4>
                                                <p className="text-xs font-medium text-zinc-500 leading-relaxed max-w-[200px]">{tmp.desc}</p>
                                            </div>
                                            <ChevronRight className={cn("w-6 h-6 transition-all", config.templateId === tmp.id ? "text-indigo-600" : "text-zinc-200")} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Passo 2: Informações Críticas */}
                        {currentStep === 2 && (
                            <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">VAMOS DAR NOME AOS BOIS</h3>

                                <div className="space-y-6">
                                    <Input label="Título Chamativo (Headline)" value={config.customization.heroTitle} onChange={e => handleChange('heroTitle', e.target.value)} placeholder="Ex: Seu Olhar no Próximo Nível" />
                                    <Input label="Subtítulo Descritivo" value={config.customization.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} placeholder="Ex: Especialistas em estética facial de alta performance." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="WhatsApp (Ex: 5591988887777)" value={config.customization.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="Agendamentos diretos" />
                                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mostrar Preços?</span>
                                            <button onClick={() => handleChange('showPrices', !config.customization.showPrices)} className={cn("w-12 h-6 rounded-full transition-all relative", config.customization.showPrices ? "bg-green-500" : "bg-zinc-200")}>
                                                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", config.customization.showPrices ? "left-7" : "left-1")} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Layout className="w-3 h-3" /> Imagem de Capa (Opcional)</label>
                                    <ImageUploader onUpload={(url) => handleChange('heroImageUrl', url)} label="Subir Banner Principal" />
                                    {config.customization.heroImageUrl && (
                                        <div className="relative h-40 rounded-[2rem] overflow-hidden border border-zinc-100 shadow-inner group">
                                            <Image src={config.customization.heroImageUrl} fill className="object-cover" alt="Banner" unoptimized />
                                            <button
                                                onClick={() => handleChange('heroImageUrl', '')}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                            >
                                                <div className="bg-red-500 p-3 rounded-full shadow-lg">
                                                    <Trash2 className="w-5 h-5 text-white" />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Passo 3: Visual & Galeria */}
                        {currentStep === 3 && (
                            <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                                <h3 className="text-xl font-black text-zinc-900 border-l-4 border-indigo-600 pl-4 mb-8">OS DETALHES QUE CONVENCEM</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Settings className="w-3 h-3" /> Sua Identidade (Logo)</label>
                                    <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                                        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center overflow-hidden relative group">
                                            {config.customization.logoUrl ? (
                                                <>
                                                    <Image src={config.customization.logoUrl} fill className="object-cover" alt="Logo" unoptimized />
                                                    <button
                                                        onClick={() => handleChange('logoUrl', '')}
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white" />
                                                    </button>
                                                </>
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-zinc-100" />
                                            )}
                                        </div>
                                        <div className="flex-1"><ImageUploader onUpload={(url) => handleChange('logoUrl', url)} label="Subir Logo" /></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Seus Melhores Trabalhos</label> <span className="text-[10px] font-black text-zinc-300">Máx 6</span></div>
                                    <ImageUploader onUpload={(url) => { if ((config.customization.galleryUrls || []).length >= 6) return toast.error("Limite de 6 fotos"); handleChange('galleryUrls', [...(config.customization.galleryUrls || []), url]); }} label="Adicionar Foto à Galeria" />
                                    <div className="grid grid-cols-3 gap-3">
                                        {(config.customization.galleryUrls || []).map((url, i) => (
                                            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
                                                <Image src={url} fill className="object-cover" alt="G" unoptimized />
                                                <button onClick={() => { const upd = config.customization.galleryUrls.filter((_, idx) => idx !== i); handleChange('galleryUrls', upd); }}
                                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 className="w-5 h-5 text-white" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Passo 4: Finish */}
                        {currentStep === 4 && (
                            <motion.div key="s4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-10">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100"><CheckCircle2 className="w-12 h-12" /></div>
                                <div><h3 className="text-3xl font-black text-zinc-900 tracking-tight">PRONTO PARA O SUCESSO?</h3><p className="text-zinc-500 font-medium mt-3 max-w-sm mx-auto">Clique em Publicar para liberar seu novo site profissional para o mundo.</p></div>
                                <Card padding="p-8" className="bg-zinc-900 text-white max-w-sm mx-auto space-y-4 border-none shadow-2xl rounded-[2.5rem]">
                                    <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">URL PÚBLICA</div>
                                    <div className="text-xl font-mono tracking-tight font-black">agendapro.com/{config.slug}</div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <Button onClick={() => window.open(`/${config.slug}`, '_blank')} className="w-full bg-white text-black hover:bg-zinc-100 h-14 rounded-2xl"><ExternalLink className="w-4 h-4 mr-2" /> Visitar Site</Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Wizard Footer Controls */}
                <div className="p-10 border-t border-zinc-100 bg-white flex items-center justify-between">
                    <button onClick={() => currentStep > 1 && setCurrentStep(s => s - 1)} className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all", currentStep === 1 && "opacity-0 pointer-events-none")}><ArrowLeft className="w-3 h-3" /> Voltar</button>
                    {currentStep < 4 ? (
                        <Button onClick={currentStep === 3 ? () => handleSave(true) : () => setCurrentStep(s => s + 1)} className="px-12 h-16 rounded-2xl shadow-2xl shadow-indigo-100 text-sm font-black uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 text-white" loading={saving}>
                            {currentStep === 3 ? "PUBLICAR AGORA" : "PRÓXIMO PASSO"} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={() => handleSave(true)} className="px-12 h-16 rounded-2xl bg-indigo-600 text-white" loading={saving}>ATUALIZAR SITE</Button>
                    )}
                </div>
            </div>

            {/* Right Panel: Instant Preview */}
            <div className="w-[500px] h-full hidden lg:flex flex-col bg-[#F8F9FC] p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Live Preview</h3></div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-zinc-100">
                        <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><SmartphoneIcon className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><MonitorIcon className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className={cn("bg-[#0F172A] rounded-[3rem] shadow-2xl transition-all duration-700 overflow-hidden border-[10px] border-[#1E293B] relative",
                        previewMode === 'mobile' ? "w-[300px] h-[600px]" : "w-full h-full max-h-[550px]")}>
                        {previewMode === 'mobile' && <div className="absolute top-0 inset-x-0 h-6 z-50 flex items-center justify-center"><div className="w-20 h-4 bg-[#1E293B] rounded-full" /></div>}
                        <iframe src={`/${config.slug}?preview=true&template=${config.templateId}&title=${encodeURIComponent(config.customization.heroTitle)}&sub=${encodeURIComponent(config.customization.heroSubtitle)}&logo=${encodeURIComponent(config.customization.logoUrl)}&banner=${encodeURIComponent(config.customization.heroImageUrl)}&showPrices=${config.customization.showPrices}`}
                            className="w-full h-full border-none pt-4 bg-white" key={JSON.stringify(config)} />
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3 justify-center relative z-10">
                    <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(Object.values(config.customization).filter(v => v && (Array.isArray(v) ? v.length > 0 : v !== '')).length / 7) * 100}%` }} className="h-full bg-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase">Qualidade</span>
                </div>
            </div>
        </div>
    );
}
