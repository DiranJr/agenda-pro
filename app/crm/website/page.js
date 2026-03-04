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
    Trash2
} from "lucide-react";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { ImageUploader } from "@/app/components/ui/uploader";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const TEMPLATES = [
    {
        id: 'glow',
        name: 'Glow Studio',
        desc: 'Elegante e feminino. Ideal para lash e estética.',
        primary: '#E11D48',
        bg: 'bg-white',
        surface: 'bg-pink-50',
        radius: '1.75rem', // 28px
        preview_bg: 'bg-pink-50',
        preview_accent: 'bg-rose-500',
    },
    {
        id: 'velvet',
        name: 'Velvet Beauty',
        desc: 'Dark luxury e sofisticado. Clínicas de alto padrão.',
        primary: '#BE185D',
        bg: 'bg-zinc-950',
        surface: 'bg-zinc-900',
        radius: '1.625rem', // 26px
        preview_bg: 'bg-zinc-950',
        preview_accent: 'bg-pink-700',
    },
    {
        id: 'pure',
        name: 'Pure Skin',
        desc: 'Clean e minimalista. Foco em skincare e spa.',
        primary: '#14B8A6',
        bg: 'bg-white',
        surface: 'bg-teal-50',
        radius: '1.875rem', // 30px
        preview_bg: 'bg-white',
        preview_accent: 'bg-teal-500',
    },
    {
        id: 'aura',
        name: 'Aura Studio',
        desc: 'Moderno e instagramável. Estúdios criativos.',
        primary: '#7C3AED',
        bg: 'bg-white',
        surface: 'bg-violet-50',
        radius: '1.5rem', // 24px
        preview_bg: 'bg-violet-50',
        preview_accent: 'bg-violet-600',
    },
];

export default function WebsiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');
    const [previewMode, setPreviewMode] = useState('mobile');
    const [hasChanges, setHasChanges] = useState(false);
    const [lastPublished, setLastPublished] = useState(null);
    const [config, setConfig] = useState({
        theme: {
            colors: { primary: '#E11D48', secondary: '#FCE7F3' },
            borderRadius: '1.75rem',
            layoutVariant: 'glow',
        },
        websiteConfig: {
            heroTitle: 'Sua melhor versão começa aqui.',
            heroSubtitle: 'Atendimento premium e agenda online em poucos segundos.',
            logoUrl: '',
            heroImageUrl: '',
            showPrices: true,
            gallery: [],
        },
        slug: ''
    });

    // Bloquear saída com alterações não salvas
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    useEffect(() => {
        fetch('/api/crm/website')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    const tenant = data.tenant;
                    setConfig(prev => ({
                        ...prev,
                        theme: tenant.theme || prev.theme,
                        websiteConfig: tenant.websiteConfig || prev.websiteConfig,
                        slug: tenant.slug
                    }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (section, key, value) => {
        setHasChanges(true);
        if (section === 'root') {
            setConfig(prev => ({ ...prev, [key]: value }));
        } else {
            setConfig(prev => ({
                ...prev,
                [section]: { ...prev[section], [key]: value }
            }));
        }
    };

    const handleThemeColorChange = (key, value) => {
        setHasChanges(true);
        setConfig(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                colors: { ...prev.theme.colors, [key]: value }
            }
        }));
    };

    const handleSelectTemplate = (tmp) => {
        setHasChanges(true);
        setConfig(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                layoutVariant: tmp.id,
                borderRadius: tmp.radius,
                colors: { ...prev.theme.colors, primary: tmp.primary, secondary: tmp.surface.replace('bg-', '#') }
            }
        }));
        toast.success(`Template ${tmp.name} aplicado!`);
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('/api/crm/website', {
            method: 'PATCH',
            body: JSON.stringify({
                theme: config.theme,
                websiteConfig: config.websiteConfig
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success("Alterações publicadas com sucesso!");
            setHasChanges(false);
            setLastPublished(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        } else {
            toast.error("Ocorreu um erro ao publicar seu site.");
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-50 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Abrindo Estúdio Visual...</p>
        </div>
    );

    const tabs = [
        { id: 'branding', label: 'Identidade', icon: Palette },
        { id: 'hero', label: 'Capa / Hero', icon: ImageIcon },
        { id: 'gallery', label: 'Galeria', icon: ImageIcon },
        { id: 'content', label: 'Conteúdo', icon: Layout },
        { id: 'seo', label: 'SEO / Google', icon: Search },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-6 lg:-m-12 overflow-hidden bg-zinc-50">
            {/* Editor Panel */}
            <div className="flex-1 flex flex-col min-w-[400px] border-r border-zinc-200 bg-white">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-10 space-y-10">
                        <div>
                            <div className="flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
                                <Sparkles className="w-4 h-4" />
                                Editor Visual
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Personalize seu Site</h2>
                            <p className="text-zinc-500 font-medium mt-2">Construa uma experiência única para seus clientes.</p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex p-1.5 bg-zinc-100 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-white text-zinc-900 shadow-sm"
                                            : "text-zinc-400 hover:text-zinc-600"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {activeTab === 'branding' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Cor Primária</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="color"
                                                    value={config.theme.colors.primary}
                                                    onChange={e => handleThemeColorChange('primary', e.target.value)}
                                                    className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg cursor-pointer overflow-hidden p-0"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-zinc-900">{config.theme.colors.primary}</p>
                                                    <p className="text-[10px] text-zinc-400 uppercase font-black">Hex Code</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Cor Secundária</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="color"
                                                    value={config.theme.colors.secondary || '#18181b'}
                                                    onChange={e => handleThemeColorChange('secondary', e.target.value)}
                                                    className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg cursor-pointer overflow-hidden p-0"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-zinc-900">{config.theme.colors.secondary || '#18181b'}</p>
                                                    <p className="text-[10px] text-zinc-400 uppercase font-black">Hex Code</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Arredondamento</label>
                                            <select
                                                value={config.theme.borderRadius}
                                                onChange={e => handleChange('theme', 'borderRadius', e.target.value)}
                                                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm"
                                            >
                                                <option value="0rem">Quadrado (0px)</option>
                                                <option value="0.75rem">Suave (12px)</option>
                                                <option value="1.5rem">Arredondado (24px)</option>
                                                <option value="3rem">Full (48px)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Templates de Design</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {TEMPLATES.map(tmp => (
                                                <button
                                                    key={tmp.id}
                                                    onClick={() => handleSelectTemplate(tmp)}
                                                    className={cn(
                                                        "p-4 rounded-[1.75rem] border-2 text-left flex items-center gap-5 transition-all group overflow-hidden",
                                                        config.theme.layoutVariant === tmp.id
                                                            ? "bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-100"
                                                            : "bg-white border-zinc-100 hover:border-zinc-300"
                                                    )}
                                                >
                                                    {/* Mini Preview */}
                                                    <div className={cn("w-20 h-28 rounded-xl shrink-0 overflow-hidden relative border border-zinc-200/20", tmp.bg)}>
                                                        {/* Mock Header */}
                                                        <div className="p-2 flex justify-center">
                                                            <div className={cn("w-6 h-6 rounded-full", tmp.preview_accent)} />
                                                        </div>
                                                        {/* Mock Title */}
                                                        <div className="px-2 space-y-1">
                                                            <div className={cn("h-1 w-full rounded-full opacity-60", tmp.preview_accent)} />
                                                            <div className={cn("h-1 w-3/4 rounded-full opacity-20 bg-zinc-400")} />
                                                        </div>
                                                        {/* Mock Cards */}
                                                        <div className="px-2 mt-2 space-y-1.5">
                                                            <div className={cn("h-3 rounded-md border border-zinc-100 shadow-sm", tmp.surface)} />
                                                            <div className={cn("h-3 rounded-md border border-zinc-100 shadow-sm", tmp.surface)} />
                                                        </div>
                                                        {/* Active check */}
                                                        {config.theme.layoutVariant === tmp.id && (
                                                            <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-zinc-900 mb-1 flex items-center gap-2">
                                                            {tmp.name}
                                                            {config.theme.layoutVariant === tmp.id && <Badge variant="indigo" className="py-0">Ativo</Badge>}
                                                        </h4>
                                                        <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">{tmp.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Fotos do seu Trabalho</label>
                                        <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Até 10 fotos</span>
                                    </div>

                                    <ImageUploader
                                        onUpload={(url) => {
                                            const currentGallery = config.websiteConfig.gallery || [];
                                            handleChange('websiteConfig', 'gallery', [...currentGallery, url]);
                                        }}
                                        label="Clique ou arraste para subir fotos da galeria"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {(config.websiteConfig.gallery || []).map((url, index) => (
                                            <div key={index} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-zinc-100 bg-zinc-50 shadow-sm transition-all hover:shadow-md">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={url} alt={`Foto da galeria ${index + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => {
                                                            const newGallery = config.websiteConfig.gallery.filter((_, i) => i !== index);
                                                            handleChange('websiteConfig', 'gallery', newGallery);
                                                        }}
                                                        className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(config.websiteConfig.gallery || []).length === 0 && (
                                            <div className="col-span-2 p-12 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200 flex flex-col items-center gap-4 text-center">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-300 shadow-sm">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Sua galeria está vazia</p>
                                                    <p className="text-[10px] font-medium text-zinc-400 mt-1 uppercase tracking-tight">Mostre o seu melhor trabalho para converter mais clientes.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed pt-4 border-t border-zinc-50">Dica: Use URLs de imagens do Instagram, Unsplash ou qualquer link público direto. Em breve: upload nativo.</p>
                                </div>
                            )}

                            {activeTab === 'hero' && (
                                <div className="space-y-8">
                                    <Input
                                        label="Título Principal (Hero)"
                                        value={config.websiteConfig.heroTitle}
                                        onChange={e => handleChange('websiteConfig', 'heroTitle', e.target.value)}
                                        placeholder="Ex: Seu Olhar no Próximo Nível"
                                    />
                                    <Input
                                        label="Subtítulo Descritivo"
                                        value={config.websiteConfig.heroSubtitle}
                                        onChange={e => handleChange('websiteConfig', 'heroSubtitle', e.target.value)}
                                        placeholder="Ex: Agende seu procedimento com os melhores profissionais."
                                    />
                                    <Input
                                        label="URL da Imagem de Capa (Manual)"
                                        value={config.websiteConfig.heroImageUrl}
                                        onChange={e => handleChange('websiteConfig', 'heroImageUrl', e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Upload de Capa</label>
                                        <ImageUploader
                                            onUpload={(url) => handleChange('websiteConfig', 'heroImageUrl', url)}
                                            label="Substituir imagem de capa"
                                        />
                                    </div>
                                    <div className="p-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-center">
                                        {config.websiteConfig.heroImageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={config.websiteConfig.heroImageUrl} alt="Imagem de capa do site" className="h-32 w-full object-cover rounded-xl shadow-sm" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <ImageIcon className="w-8 h-8 text-zinc-300" />
                                                <p className="text-[10px] font-black uppercase text-zinc-400">Sem imagem de capa</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="p-10 bg-indigo-50/30 border border-indigo-100 rounded-[2rem] space-y-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 mb-6">
                                        <Layout className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">Arquitetura de Conteúdo</h3>
                                    <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                                        Esta seção permitirá que você reorganize as vitrines de serviços, galeria de fotos e depoimentos diretamente por aqui.
                                    </p>
                                    <div className="pt-4 flex items-center gap-2">
                                        <Badge variant="indigo">Em breve</Badge>
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Disponível na próxima atualização</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-8">
                                    <div className="p-8 bg-zinc-900 text-white rounded-[2rem] space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                            <ShieldCheck className="w-4 h-4" />
                                            Google Preview
                                        </div>
                                        <div>
                                            <p className="text-blue-400 text-lg font-medium">{config.websiteConfig.heroTitle || config.slug} | Agenda Pro</p>
                                            <p className="text-green-500 text-xs">agendapro.com/{config.slug}</p>
                                            <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{config.websiteConfig.heroSubtitle || "Agende seus serviços de beleza online."}</p>
                                        </div>
                                    </div>
                                    <Input label="Site Slug" value={config.slug} disabled className="opacity-50" />
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">O slug é o seu endereço web fixo. Se precisar mudar, entre em contato com o suporte para garantir que seus links não parem de funcionar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="p-8 border-t border-zinc-100 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {hasChanges ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">Alterações não salvas</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                                    {lastPublished ? `Publicado às ${lastPublished}` : 'Tudo atualizado'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            disabled={!hasChanges}
                            loading={saving}
                            onClick={handleSave}
                            className="px-10"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Publicar Site
                        </Button>
                    </div>
                </div>
            </div>

            {/* Live Preview Panel */}
            <div className="w-[600px] h-full hidden lg:flex flex-col p-10 bg-[#F4F4F9]">
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Preview ao Vivo</h3>
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-zinc-100">
                            {[
                                { id: 'mobile', icon: Smartphone },
                                { id: 'desktop', icon: Laptop }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setPreviewMode(item.id)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        previewMode === item.id ? "bg-zinc-100 text-indigo-600 shadow-inner" : "text-zinc-300 hover:text-zinc-600"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <a
                        href={`/${config.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                    >
                        Ver Site Real
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <div className={cn(
                        "bg-white rounded-[3rem] shadow-2xl transition-all duration-700 overflow-hidden border-8 border-zinc-900 relative",
                        previewMode === 'mobile' ? "w-[340px] h-[680px]" : "w-full h-full max-h-[600px]"
                    )}>
                        {/* Mock Browser Header */}
                        <div className="absolute top-0 inset-x-0 h-12 bg-zinc-900 flex items-center justify-center">
                            <div className="w-20 h-4 bg-zinc-800 rounded-full" />
                        </div>
                        <iframe
                            src={`/${config.slug}?preview=true`}
                            className="w-full h-full pt-12 border-none"
                            key={JSON.stringify(config)} // Force reload on changes for real instant sync if possible
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}
