"use client";
import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Globe,
    MapPin,
    Clock,
    Save,
    ShieldCheck,
    Smartphone,
    Info
} from "lucide-react";
import { PageHeader, Input } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";

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
        fetch('/api/crm/website')
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
            toast.success("Configurações atualizadas!");
        } else {
            toast.error("Ocorreu um erro ao salvar.");
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <SettingsIcon className="w-12 h-12 text-zinc-200 animate-spin" />
            <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">Acessando sistema...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <PageHeader
                title="Ajustes do Sistema"
                subtitle="Gerencie os dados técnicos, operacionais e de fuso horário do seu negócio."
            />

            <form onSubmit={handleSave} className="space-y-10">
                <Card padding="p-10" className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight">Dados do Estabelecimento</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Input
                            label="Nome Fantasia / Bio"
                            required
                            value={tenant.name}
                            onChange={e => setTenant({ ...tenant, name: e.target.value })}
                            placeholder="Ex: Studio Josy Silva"
                        />
                        <div className="space-y-2">
                            <Input
                                label="Endereço Web (Slug)"
                                required
                                value={tenant.slug}
                                onChange={e => setTenant({ ...tenant, slug: e.target.value })}
                                placeholder="ex: studio-josy"
                            />
                            <div className="flex items-center gap-2 px-2">
                                <Info className="w-3 h-3 text-amber-500" />
                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Atenção: Mudar isso altera o link do seu site público.</p>
                            </div>
                        </div>
                        <Input
                            label="WhatsApp de Contato"
                            value={tenant.contactPhone}
                            onChange={e => setTenant({ ...tenant, contactPhone: e.target.value })}
                            placeholder="(00) 00000-0000"
                        />
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Região / Fuso Horário</label>
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
                </Card>

                <Card padding="p-8" className="bg-indigo-600 border-none text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Segurança & Backup</h3>
                            <p className="text-indigo-100 text-sm opacity-80">Seus dados são criptografados e protegidos.</p>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        loading={saving}
                        className="w-full md:w-auto bg-white text-indigo-600 hover:bg-white/90 px-12 py-5 rounded-[1.5rem]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Ajustes
                    </Button>
                </Card>
            </form>
        </div>
    );
}
