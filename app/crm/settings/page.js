"use client";
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tenant, setTenant] = useState({
        name: '',
        slug: '',
        contactPhone: '',
        timezone: 'America/Sao_Paulo',
    });

    useEffect(() => {
        fetch('/api/crm/website') // Usando o endpoint de website que já retorna o tenant
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    setTenant({
                        name: data.tenant.name || '',
                        slug: data.tenant.slug || '',
                        contactPhone: data.tenant.contactPhone || '',
                        timezone: data.tenant.timezone || 'America/Sao_Paulo',
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/crm/settings', {
            method: 'PATCH',
            body: JSON.stringify(tenant),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            alert("Configurações salvas!");
        } else {
            alert("Erro ao salvar.");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-zinc-400 font-bold uppercase tracking-widest">Acessando sistema...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 tracking-tight">Configurações Gerais</h1>
                <p className="text-zinc-500 font-medium">Gerencie os dados técnicos e de contato do seu estabelecimento.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <section className="bg-white border border-zinc-200 rounded-[3rem] p-10 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-indigo-600"></span>
                        Dados do Estabelecimento
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Nome Fantasia</label>
                            <input
                                required
                                value={tenant.name}
                                onChange={e => setTenant({ ...tenant, name: e.target.value })}
                                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Slug (URL do Site)</label>
                            <input
                                required
                                value={tenant.slug}
                                onChange={e => setTenant({ ...tenant, slug: e.target.value })}
                                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                placeholder="ex: studio-beleza"
                            />
                            <p className="text-[10px] text-zinc-400 mt-2 ml-1">Cuidado: Mudar o slug alterará o link do seu site público.</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Telefone de Contato</label>
                            <input
                                value={tenant.contactPhone}
                                onChange={e => setTenant({ ...tenant, contactPhone: e.target.value })}
                                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Fuso Horário</label>
                            <select
                                value={tenant.timezone}
                                onChange={e => setTenant({ ...tenant, timezone: e.target.value })}
                                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                            >
                                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                <option value="America/Bahia">Bahia (GMT-3)</option>
                                <option value="America/Manaus">Manaus (GMT-4)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 text-white px-12 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Sincronizando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
