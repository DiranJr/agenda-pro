"use client";
import { useState, useEffect } from 'react';

const templates = [
    { id: 'modern', name: 'Moderno', preview: 'bg-white', description: 'Limpo e focado em tipografia.' },
    { id: 'glass', name: 'Glassmorphism', preview: 'bg-indigo-50', description: 'Efeitos de vidro e transparência.' },
    { id: 'minimal', name: 'Minimalista', preview: 'bg-zinc-50', description: 'Extrema simplicidade e foco.' },
    { id: 'elegant', name: 'Elegante', preview: 'bg-stone-50', description: 'Sofisticado com alto contraste.' },
    { id: 'dark', name: 'Dark Mode', preview: 'bg-zinc-900', description: 'Visual noturno e futurista.' },
];

export default function WebsiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        theme: {
            colors: { primary: '#6366f1', secondary: '#a855f7' },
            borderRadius: '1rem',
            layoutVariant: 'modern'
        },
        websiteConfig: {
            heroTitle: '',
            heroSubtitle: '',
            heroImageUrl: '',
            showPrices: true
        },
        slug: ''
    });

    useEffect(() => {
        fetch('/api/crm/website')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    setConfig({
                        theme: data.tenant.theme || config.theme,
                        websiteConfig: data.tenant.websiteConfig || config.websiteConfig,
                        slug: data.tenant.slug
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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
            alert("Configurações publicadas com sucesso!");
        } else {
            alert("Erro ao salvar.");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-zinc-400 font-bold">Iniciando motor visual...</div>;

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Design & Identidade</h1>
                    <p className="text-zinc-500 font-medium">Configure como o mundo vê o seu salão.</p>
                </div>
                <div className="flex gap-4">
                    <a
                        href={`/${config.slug}`}
                        target="_blank"
                        className="px-6 py-3 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
                    >
                        <span>Ver Site</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                    >
                        {saving ? 'Publicando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-10 min-h-0">
                {/* Editor Area */}
                <div className="xl:col-span-3 space-y-8 overflow-y-auto pr-2">

                    {/* Templates Selector */}
                    <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-indigo-600"></span>
                            Templates Disponíveis
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => setConfig({ ...config, theme: { ...config.theme, layoutVariant: tpl.id } })}
                                    className={`relative p-4 rounded-2xl border-2 transition-all text-left ${config.theme.layoutVariant === tpl.id
                                            ? 'border-indigo-600 bg-indigo-50/50'
                                            : 'border-zinc-100 hover:border-zinc-200'
                                        }`}
                                >
                                    <div className={`w-full h-20 rounded-lg mb-3 shadow-inner ${tpl.preview}`}></div>
                                    <div className="font-bold text-sm">{tpl.name}</div>
                                    <p className="text-[10px] text-zinc-500 mt-1">{tpl.description}</p>
                                    {config.theme.layoutVariant === tpl.id && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Hero Section */}
                    <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-indigo-600"></span>
                            Conteúdo Hero
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 mb-2 block uppercase">Título Principal</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Seu Salão"
                                        value={config.websiteConfig.heroTitle}
                                        onChange={e => setConfig({ ...config, websiteConfig: { ...config.websiteConfig, heroTitle: e.target.value } })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 mb-2 block uppercase">Subtítulo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: O melhor cuidado"
                                        value={config.websiteConfig.heroSubtitle}
                                        onChange={e => setConfig({ ...config, websiteConfig: { ...config.websiteConfig, heroSubtitle: e.target.value } })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-2 block uppercase">URL da Imagem Hero</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={config.websiteConfig.heroImageUrl}
                                        onChange={e => setConfig({ ...config, websiteConfig: { ...config.websiteConfig, heroImageUrl: e.target.value } })}
                                        className="flex-1 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-mono focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                    {config.websiteConfig.heroImageUrl && (
                                        <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-zinc-100">
                                            <img src={config.websiteConfig.heroImageUrl} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-2 font-medium">Recomendado: 1200x800px. Você pode usar links do Unsplash.</p>
                            </div>
                        </div>
                    </section>

                    {/* Estilo e Cores */}
                    <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-indigo-600"></span>
                            Estilo & Cores
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-4 block uppercase">Paleta de Cores</label>
                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 border border-zinc-100 rounded-2xl flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={config.theme.colors.primary}
                                            onChange={e => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme.colors, primary: e.target.value } } })}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-4 border-white shadow-sm ring-1 ring-zinc-200 overflow-hidden"
                                        />
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-zinc-400">Primária</div>
                                            <div className="text-xs font-mono font-bold uppercase">{config.theme.colors.primary}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 border border-zinc-100 rounded-2xl flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={config.theme.colors.secondary}
                                            onChange={e => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme.colors, secondary: e.target.value } } })}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-4 border-white shadow-sm ring-1 ring-zinc-200 overflow-hidden"
                                        />
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-zinc-400">Secundária</div>
                                            <div className="text-xs font-mono font-bold uppercase">{config.theme.colors.secondary}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-4 block uppercase">Bordas das Imagens</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['0px', '8px', '24px', '100px'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setConfig({ ...config, theme: { ...config.theme, borderRadius: val } })}
                                            className={`p-3 border-2 rounded-xl transition-all ${config.theme.borderRadius === val ? 'border-indigo-600 bg-indigo-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                                        >
                                            <div className="w-full aspect-square bg-zinc-200 mx-auto mb-2" style={{ borderRadius: val }}></div>
                                            <div className="text-[10px] font-bold text-center">{val === '100px' ? 'Round' : val}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Preview Area (Always Visible on Large Screens) */}
                <div className="xl:col-span-2 relative min-h-[600px]">
                    <div className="sticky top-6">
                        <div className="absolute -top-6 left-0 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Visualização Mobile</div>
                        <div className="w-full aspect-[9/18] max-w-[340px] mx-auto bg-zinc-900 rounded-[3.5rem] border-[14px] border-zinc-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative">
                            {/* Device Hardware Details */}
                            <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-center gap-2 z-30">
                                <div className="w-20 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                                </div>
                            </div>

                            {/* App Content Preview */}
                            <div className={`w-full h-full overflow-y-auto ${config.theme.layoutVariant === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white'}`}>

                                {/* Hero Area */}
                                <div className="relative pt-12 pb-8 px-6 text-center overflow-hidden">
                                    {config.websiteConfig.heroImageUrl ? (
                                        <div className="absolute inset-0 z-0">
                                            <img src={config.websiteConfig.heroImageUrl} className="w-full h-full object-cover opacity-30" alt="Hero" />
                                            <div className={`absolute inset-0 bg-gradient-to-b ${config.theme.layoutVariant === 'dark' ? 'from-zinc-900/50 to-zinc-900' : 'from-white/50 to-white'}`}></div>
                                        </div>
                                    ) : null}

                                    <div className="relative z-10">
                                        <div
                                            style={{ backgroundColor: config.theme.colors.primary }}
                                            className="w-20 h-20 rounded-3xl mx-auto mb-6 shadow-xl flex items-center justify-center text-white text-3xl font-black"
                                        >
                                            {config.websiteConfig.heroTitle?.[0] || 'A'}
                                        </div>
                                        <h2 className={`text-2xl font-black mb-2 ${config.theme.layoutVariant === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                                            {config.websiteConfig.heroTitle || 'Seu Espaço'}
                                        </h2>
                                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
                                            {config.websiteConfig.heroSubtitle || 'O melhor cuidado para você.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 space-y-6">
                                    <div className={`h-[1px] w-full ${config.theme.layoutVariant === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}></div>

                                    <div className="text-[10px] font-black uppercase text-zinc-400 spacing-widest">Procedimentos</div>

                                    {[1, 2].map(i => (
                                        <div key={i} className={`p-4 rounded-3xl border transition-all flex gap-4 items-center ${config.theme.layoutVariant === 'glass' ? 'bg-white/10 backdrop-blur-md border-white/20' :
                                                config.theme.layoutVariant === 'dark' ? 'bg-zinc-800 border-zinc-700' :
                                                    'bg-white border-zinc-100'
                                            }`} style={{ borderRadius: config.theme.borderRadius }}>
                                            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex-shrink-0 overflow-hidden">
                                                <div className="w-full h-full bg-zinc-200"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-xs mb-1">Serviço Exemplo {i}</div>
                                                <div className="text-[10px] opacity-50">60 min</div>
                                            </div>
                                            <div style={{ color: config.theme.colors.primary }} className="font-black text-xs">R$ 150</div>
                                        </div>
                                    ))}

                                    <button
                                        style={{ backgroundColor: config.theme.colors.primary, borderRadius: config.theme.borderRadius }}
                                        className="w-full py-5 text-white font-black text-xs shadow-xl transition-all active:scale-95"
                                    >
                                        VER DISPONIBILIDADE
                                    </button>
                                </div>

                                <div className="p-10 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-30">
                                    Agenda Pro Cloud
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
