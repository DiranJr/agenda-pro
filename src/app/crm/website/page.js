"use client";
import { useState, useEffect } from 'react';

export default function WebsiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        theme: {
            colors: { primary: '#000000', secondary: '#666666' },
            borderRadius: '1rem'
        },
        websiteConfig: {
            heroTitle: '',
            heroSubtitle: '',
            logoUrl: '',
            showPrices: true
        },
        slug: ''
    });

    useEffect(() => {
        // Carregar configurações atuais do tenant
        // No mundo real, getRequestContext traria isso ou faríamos um fetch
        fetch('/api/crm/test') // Apenas para validar acesso por enquanto
            .then(() => {
                // Mock data para agilidade (em produção viria do servidor no page.js)
                setConfig(prev => ({
                    ...prev,
                    websiteConfig: {
                        heroTitle: 'Studio Josy Silva',
                        heroSubtitle: 'Especialista em Cílios e Sobrancelhas',
                        logoUrl: '',
                        showPrices: true
                    },
                    slug: 'studio-josy'
                }));
                setLoading(false);
            });
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
            alert("Configurações salvas!");
        } else {
            alert("Erro ao salvar.");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-zinc-400">Carregando...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2">Meu Site</h1>
                    <p className="text-zinc-500">Personalize a aparência do seu mini-site público.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {saving ? 'Salvando...' : 'Publicar Alterações'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-0">
                {/* Editor */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 overflow-y-auto space-y-10 shadow-sm">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Identidade Visual</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-2 block">Cores da Marca</label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl">
                                            <input
                                                type="color"
                                                value={config.theme.colors.primary}
                                                onChange={e => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme.colors, primary: e.target.value } } })}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                            />
                                            <span className="text-sm font-medium">Primária</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl">
                                            <input
                                                type="color"
                                                value={config.theme.colors.secondary}
                                                onChange={e => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme.colors, secondary: e.target.value } } })}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                            />
                                            <span className="text-sm font-medium">Secundária</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-2 block">Arredondamento dos Cantos</label>
                                <select
                                    value={config.theme.borderRadius}
                                    onChange={e => setConfig({ ...config, theme: { ...config.theme, borderRadius: e.target.value } })}
                                    className="w-full p-3 border border-zinc-100 rounded-xl text-sm font-medium outline-none"
                                >
                                    <option value="0">Quadrado (0px)</option>
                                    <option value="0.5rem">Suave (8px)</option>
                                    <option value="1rem">Arredondado (16px)</option>
                                    <option value="2rem">Muito Redondo (32px)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Conteúdo da Home</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-2 block">Título de Boas-vindas</label>
                                <input
                                    type="text"
                                    value={config.websiteConfig.heroTitle}
                                    onChange={e => setConfig({ ...config, websiteConfig: { ...config.websiteConfig, heroTitle: e.target.value } })}
                                    className="w-full p-3 border border-zinc-100 rounded-xl text-sm outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 mb-2 block">Subtítulo</label>
                                <textarea
                                    value={config.websiteConfig.heroSubtitle}
                                    onChange={e => setConfig({ ...config, websiteConfig: { ...config.websiteConfig, heroSubtitle: e.target.value } })}
                                    className="w-full p-3 border border-zinc-100 rounded-xl text-sm outline-none focus:border-black h-24"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Live Preview */}
                <div className="relative group">
                    <div className="absolute -top-6 left-0 text-[10px] font-black uppercase tracking-widest text-zinc-400">Preview ao Vivo</div>
                    <div className="w-full h-full bg-zinc-200 rounded-[3rem] border-[12px] border-zinc-900 shadow-2xl overflow-hidden relative">
                        {/* Mockup da tela do celular */}
                        <div className="absolute inset-x-0 top-0 h-6 bg-zinc-900 z-20 flex justify-center items-end pb-1">
                            <div className="w-20 h-3 bg-zinc-800 rounded-full" />
                        </div>

                        <div className="w-full h-full bg-white overflow-y-auto pt-6 scale-90 origin-top">
                            <div className="p-8 text-center border-b border-zinc-50">
                                <div
                                    style={{ backgroundColor: config.theme.colors.primary, borderRadius: config.theme.borderRadius }}
                                    className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white font-black text-xl"
                                >
                                    {config.websiteConfig.heroTitle?.[0] || 'A'}
                                </div>
                                <h1 className="text-2xl font-black mb-2">{config.websiteConfig.heroTitle || 'Seu Nome'}</h1>
                                <p className="text-zinc-400 text-xs leading-relaxed">{config.websiteConfig.heroSubtitle || 'Seu subtítulo aqui.'}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="h-2 w-20 bg-zinc-100 rounded-full mb-4" />
                                {[1, 2].map(i => (
                                    <div key={i} className="p-4 border border-zinc-100 flex justify-between items-center rounded-xl">
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 bg-zinc-100 rounded-full" />
                                            <div className="h-2 w-12 bg-zinc-50 rounded-full" />
                                        </div>
                                        <div style={{ color: config.theme.colors.primary }} className="font-black text-xs">R$ 0,00</div>
                                    </div>
                                ))}
                                <button
                                    style={{ backgroundColor: config.theme.colors.primary, borderRadius: config.theme.borderRadius }}
                                    className="w-full py-4 text-white font-black text-xs mt-6"
                                >
                                    Agendar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
