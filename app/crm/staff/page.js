"use client";
import { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Phone,
    Star,
    CheckCircle2,
    X,
    User,
    Settings,
    Scissors
} from "lucide-react";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadStaff();
        loadServices();
    }, []);

    const loadStaff = () => {
        setLoading(true);
        fetch('/api/crm/staff')
            .then(res => res.json())
            .then(data => {
                setStaff(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    };

    const loadServices = () => {
        fetch('/api/crm/services')
            .then(res => res.json())
            .then(data => setServices(Array.isArray(data) ? data : []));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const method = editingMember.id ? 'PATCH' : 'POST';
        const url = editingMember.id ? `/api/crm/staff/${editingMember.id}` : '/api/crm/staff';

        const res = await fetch(url, {
            method,
            body: JSON.stringify(editingMember),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success("Especialista atualizado!");
            setEditingMember(null);
            loadStaff();
        } else {
            const err = await res.json();
            toast.error("Erro: " + (err.error?.message || "Algo deu errado"));
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este profissional?")) return;

        const res = await fetch(`/api/crm/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success("Membro removido.");
            loadStaff();
        } else {
            toast.error("Erro ao excluir.");
        }
    };

    const toggleService = (serviceId) => {
        const currentServices = editingMember.serviceIds || [];
        if (currentServices.includes(serviceId)) {
            setEditingMember({ ...editingMember, serviceIds: currentServices.filter(id => id !== serviceId) });
        } else {
            setEditingMember({ ...editingMember, serviceIds: [...currentServices, serviceId] });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <PageHeader
                title="Sua Equipe"
                subtitle="Gerencie os talentos que fazem a mágica acontecer no Studio."
                actions={
                    <Button onClick={() => setEditingMember({ name: '', phone: '', status: 'ACTIVE', serviceIds: [] })} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Especialista
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-32 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Sincronizando equipe...</p>
                    </div>
                ) : staff.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white border border-dashed border-zinc-200 rounded-[3rem]">
                        <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <User className="w-8 h-8 text-zinc-200" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Sua equipe está vazia</h3>
                        <p className="text-zinc-500 font-medium max-w-xs mx-auto">Cadastre os profissionais para que eles possam aparecer no site de agendamento.</p>
                    </div>
                ) : staff.map(member => (
                    <Card key={member.id} className="group hover:border-indigo-200 transition-all flex flex-col pt-10">
                        <div className="relative mb-8 text-center">
                            <div className="w-24 h-24 bg-zinc-50 rounded-full border-4 border-white shadow-xl mx-auto flex items-center justify-center text-3xl font-black text-zinc-300 relative group-hover:scale-105 transition-transform">
                                {member.name?.[0] || '?'}
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white",
                                    member.status === 'ACTIVE' ? "bg-green-500" : "bg-zinc-300"
                                )}>
                                    {member.status === 'ACTIVE' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8 flex-1">
                            <h3 className="text-xl font-black text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Badge variant={member.status === 'ACTIVE' ? "success" : "default"}>
                                    {member.status === 'ACTIVE' ? 'Disponível' : 'Indisponível'}
                                </Badge>
                                <Badge variant="indigo" className="px-2">{member.services?.length || 0} Serviços</Badge>
                            </div>

                            <div className="flex flex-col items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    {member.phone || '--'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setEditingMember({ ...member, serviceIds: member.services?.map(s => s.serviceId) || [] })}
                                className="rounded-xl"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => handleDelete(member.id)}
                                className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal de Edição Profissional */}
            {editingMember && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <Card padding="p-0" className="w-full max-w-3xl my-auto animate-in zoom-in duration-300 overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-300 text-2xl font-black">
                                    {editingMember.name?.[0] || <User className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{editingMember.id ? 'Perfis de Especialista' : 'Novo Talento'}</h3>
                                    <p className="text-sm text-zinc-500 font-medium">Defina as competências e contatos do profissional.</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingMember(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Nome do Profissional"
                                    required
                                    value={editingMember.name}
                                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                                    placeholder="Ex: Amanda Lima"
                                />
                                <Input
                                    label="Fone / WhatsApp"
                                    required
                                    value={editingMember.phone}
                                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Especialidades Habilitadas</label>
                                    <Badge variant="indigo">{editingMember.serviceIds?.length || 0} Selecionados</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 shadow-inner custom-scrollbar">
                                    {services.map(service => {
                                        const isSelected = editingMember.serviceIds?.includes(service.id);
                                        return (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => toggleService(service.id)}
                                                className={cn(
                                                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-2 group relative overflow-hidden",
                                                    isSelected
                                                        ? "bg-white border-indigo-600 text-indigo-700 shadow-md"
                                                        : "bg-white/50 border-zinc-200 text-zinc-400 hover:border-zinc-300"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-0 right-0 p-1.5 bg-indigo-600 text-white rounded-bl-xl shadow-lg">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </div>
                                                )}
                                                <Scissors className={cn("w-4 h-4", isSelected ? "text-indigo-600" : "text-zinc-200")} />
                                                <span className="text-[11px] font-black uppercase tracking-tight line-clamp-2 leading-none">{service.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Status Profissional</label>
                                    <select
                                        value={editingMember.status}
                                        onChange={e => setEditingMember({ ...editingMember, status: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    >
                                        <option value="ACTIVE">Ativo / Agendável</option>
                                        <option value="INACTIVE">Pausado / Férias</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block ml-1">Horário Padrão</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <Input
                                                label="Início"
                                                type="time"
                                                value={editingMember.workSchedule?.mon?.start || "09:00"}
                                                onChange={e => {
                                                    const sched = editingMember.workSchedule || {};
                                                    ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(day => {
                                                        sched[day] = { ...sched[day], start: e.target.value, active: true };
                                                    });
                                                    setEditingMember({ ...editingMember, workSchedule: sched });
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                label="Fim"
                                                type="time"
                                                value={editingMember.workSchedule?.mon?.end || "18:00"}
                                                onChange={e => {
                                                    const sched = editingMember.workSchedule || {};
                                                    ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(day => {
                                                        sched[day] = { ...sched[day], end: e.target.value, active: true };
                                                    });
                                                    setEditingMember({ ...editingMember, workSchedule: sched });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-400 italic px-1">Configuração rápida para dias de semana.</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 rounded-[1.5rem] mt-6"
                                loading={saving}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                {editingMember.id ? 'Atualizar Perfil' : 'Contratar Especialista'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
