"use client";
import { useEffect, useState } from "react";
import {
    Globe,
    Palette,
    Layout,
    Image as ImageIcon,
    Type,
    Eye,
    Save,
    Check,
    Laptop,
    Smartphone,
    ExternalLink,
    ChevronRight,
    Sparkles,
    Search,
    ShieldCheck,
    Plus,
    Trash2,
    CheckCircle2,
    Settings,
    ArrowRight,
    ArrowLeft,
    MonitorIcon,
    SmartphoneIcon
} from "lucide-react";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { ImageUploader } from "@/app/components/ui/uploader";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SITE_TEMPLATES } from "@/lib/siteTemplates";

export default function WebsiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: Template, 2: Personalize, 3: Publish
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
                setCurrentStep(3);
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
        { id: 1, label: 'Escolha seu Template', icon: Palette },
        { id: 2, label: 'Personalize', icon: Settings },
        { id: 3, label: 'Pronto para Publicar', icon: CheckCircle2 },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-6 lg:-m-12 overflow-hidden bg-zinc-50 font-sans">
            {/* Left Panel: Workflow */}
            <div className="flex-1 flex flex-col min-w-[500px] border-r border-zinc-200 bg-white">
                {/* Wizard Header */}
                <div className="px-10 py-8 border-b border-zinc-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900">Setup em 5 Minutos</h2>
                            <p className="text-zinc-400 text-sm font-medium mt-1">Siga os passos para ter seu site profissional.</p>
                        </div>
                        <Badge variant="indigo" className="py-1 px-3">SaaS Premium</Badge>
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
                                            "text-[10px] font-black uppercase tracking-widest",
                                            currentStep === step.id ? "text-indigo-600" : "text-zinc-400"
                                        )}>
                                            Passo {step.id}
                                        </span>
                                    </div>
                                </button>
                                {idx < steps.length - 1 && <div className="w-4 h-px bg-zinc-100 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    {/* Step 1: Template Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="grid grid-cols-1 gap-4">
                                {Object.values(SITE_TEMPLATES).map(tmp => (
                                    <button
                                        key={tmp.id}
                                        onClick={() => handleSelectTemplate(tmp)}
                                        className={cn(
                                            "p-6 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all group relative overflow-hidden",
                                            config.templateId === tmp.id
                                                ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100/50 scale-[1.02]"
                                                : "bg-zinc-50 border-transparent hover:border-zinc-200"
                                        )}
                                    >
                                        <div
                                            className="w-24 h-32 rounded-2xl shrink-0 overflow-hidden relative shadow-inner flex flex-col"
                                            style={{ backgroundColor: tmp.defaults.secondaryColor }}
                                        >
                                            <div className="p-3 flex justify-center">
                                                <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: tmp.defaults.primaryColor }} />
                                            </div>
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
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{tmp.category}</span>
                                                {config.templateId === tmp.id && <Badge variant="indigo">Selecionado</Badge>}
                                            </div>
                                            <h4 className="text-xl font-black text-zinc-900 leading-tight mb-2">{tmp.name}</h4>
                                            <p className="text-xs font-medium text-zinc-500 leading-relaxed max-w-[240px]">{tmp.desc}</p>
                                        </div>

                                        <div className={cn(
                                            "absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                            config.templateId === tmp.id ? "bg-indigo-600 text-white scale-110" : "bg-zinc-200 text-zinc-400 group-hover:bg-zinc-300"
                                        )}>
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personalize */}
                    {currentStep === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
                            {/* Logo */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Sua Logo
                                </label>
                                <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center overflow-hidden">
                                        {config.customization.logoUrl ? (
                                            <img src={config.customization.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-zinc-200" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <ImageUploader
                                            onUpload={(url) => handleChange('logoUrl', url)}
                                            label="Subir Logo"
                                        />
                                        <p className="text-[10px] text-zinc-400 font-bold mt-3 uppercase tracking-tight">PNG ou JPG transparente, pref. quadrado.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Títulos */}
                            <div className="grid gap-6">
                                <Input
                                    label="Título de Impacto"
                                    value={config.customization.heroTitle}
                                    onChange={e => handleChange('heroTitle', e.target.value)}
                                    placeholder="Ex: Seu Olhar no Próximo Nível"
                                    maxLength={60}
                                />
                                <Input
                                    label="Slogan / Subtítulo"
                                    value={config.customization.heroSubtitle}
                                    onChange={e => handleChange('heroSubtitle', e.target.value)}
                                    placeholder="Ex: Especialistas em estética facial de alta performance."
                                    maxLength={120}
                                />
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-4">
                                <Input
                                    label="WhatsApp para Agendamentos"
                                    value={config.customization.whatsapp}
                                    onChange={e => handleChange('whatsapp', e.target.value)}
                                    placeholder="(99) 99999-9999"
                                />
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                                    <div>
                                        <p className="text-xs font-black text-zinc-900 uppercase">Preços Visíveis</p>
                                        <p className="text-[10px] text-zinc-400 font-bold">Mostrar valores no site.</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('showPrices', !config.customization.showPrices)}
                                        className={cn(
                                            "w-12 h-6 rounded-full transition-all relative",
                                            config.customization.showPrices ? "bg-green-500 shadow-inner" : "bg-zinc-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                            config.customization.showPrices ? "left-7" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center justify-between">
                                    <span className="flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Galeria de Fotos</span>
                                    <span>{config.customization.galleryUrls?.length || 0}/6</span>
                                </label>
                                <ImageUploader
                                    onUpload={(url) => {
                                        const current = config.customization.galleryUrls || [];
                                        if (current.length >= 6) return toast.error("Máximo de 6 fotos na galeria.");
                                        handleChange('galleryUrls', [...current, url]);
                                    }}
                                    label="Subir Foto do Trabalho"
                                />
                                <div className="grid grid-cols-3 gap-3">
                                    {config.customization.galleryUrls?.map((url, i) => (
                                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                                            <img src={url} className="w-full h-full object-cover" alt="Galeria" />
                                            <button
                                                onClick={() => {
                                                    const updated = config.customization.galleryUrls.filter((_, idx) => idx !== i);
                                                    handleChange('galleryUrls', updated);
                                                }}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Publish */}
                    {currentStep === 3 && (
                        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 py-10 text-center">
                            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100 mb-6">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Tudo Pronto!</h3>
                                <p className="text-zinc-500 font-medium mt-3 max-w-sm mx-auto">
                                    Seu site já está configurado e pronto para receber agendamentos profissionais.
                                </p>
                            </div>

                            <div className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl text-white max-w-sm mx-auto space-y-4">
                                <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Endereço Público</div>
                                <div className="text-xl font-mono tracking-tight flex items-center justify-center gap-2">
                                    agendapro.com/<span className="text-indigo-400 font-black">{config.slug}</span>
                                </div>
                                <div className="pt-4 flex flex-col gap-3">
                                    <Button onClick={() => window.open(`/${config.slug}`, '_blank')} variant="primary" className="w-full bg-white text-black hover:bg-zinc-100">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Visitar Site
                                    </Button>
                                    <Button onClick={() => setCurrentStep(1)} variant="secondary" className="w-full border-zinc-800 text-zinc-400 hover:text-white">
                                        Voltar ao Editor
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Wizard Footer Controls */}
                <div className="p-8 border-t border-zinc-100 bg-white flex items-center justify-between">
                    <div>
                        {currentStep > 1 && (
                            <button
                                onClick={() => setCurrentStep(s => s - 1)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" /> Voltar
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {currentStep < 3 ? (
                            <Button
                                onClick={currentStep === 2 ? () => handleSave(true) : () => setCurrentStep(s => s + 1)}
                                variant="primary"
                                className="px-10 h-14 rounded-2xl shadow-xl shadow-indigo-100 text-sm font-black uppercase tracking-widest"
                                loading={saving}
                            >
                                {currentStep === 2 ? (
                                    <>Publicar Meu Site <ArrowRight className="w-4 h-4 ml-2" /></>
                                ) : (
                                    <>Próximo Passo <ArrowRight className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleSave(true)}
                                variant="primary"
                                loading={saving}
                                className="px-10 h-14 rounded-2xl"
                            >
                                Atualizar Site Publicado
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel: Instant Preview */}
            <div className="w-[500px] h-full hidden lg:flex flex-col bg-[#F8F9FC] p-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Live Preview</h3>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-zinc-100">
                        <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><SmartphoneIcon className="w-4 h-4" /></button>
                        <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-indigo-50 text-indigo-600" : "text-zinc-300 hover:text-zinc-500")}><MonitorIcon className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <div
                        className={cn(
                            "bg-[#0F172A] rounded-[3rem] shadow-2xl transition-all duration-700 overflow-hidden border-[10px] border-[#1E293B] relative",
                            previewMode === 'mobile' ? "w-[300px] h-[600px]" : "w-full h-full max-h-[550px]"
                        )}
                    >
                        {/* Notch/Island area */}
                        {previewMode === 'mobile' && (
                            <div className="absolute top-0 inset-x-0 h-6 z-50 flex items-center justify-center">
                                <div className="w-20 h-4 bg-[#1E293B] rounded-full" />
                            </div>
                        )}
                        <iframe
                            src={`/${config.slug}?preview=true&template=${config.templateId}&title=${encodeURIComponent(config.customization.heroTitle)}&sub=${encodeURIComponent(config.customization.heroSubtitle)}&logo=${encodeURIComponent(config.customization.logoUrl)}&showPrices=${config.customization.showPrices}`}
                            className="w-full h-full border-none pt-4 bg-white"
                            key={JSON.stringify(config)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3 justify-center">
                    <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(Object.values(config.customization).filter(v => v && v.length > 0).length / 6) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase">Qualidade do Perfil</span>
                </div>
            </div>
        </div>
    );
}
