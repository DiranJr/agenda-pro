"use client";
import { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Clock,
    Tag as TagIcon,
    Image as ImageIcon,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    Save,
    X
} from "lucide-react";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = () => {
        setLoading(true);
        fetch('/api/crm/services')
            .then(res => res.json())
            .then(data => {
                setServices(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const method = editingService.id ? 'PATCH' : 'POST';
        const url = editingService.id ? `/api/crm/services/${editingService.id}` : '/api/crm/services';

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify(editingService),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(editingService.id ? "Serviço atualizado!" : "Novo serviço cadastrado!");
                setEditingService(null);
                loadServices();
            } else {
                const err = await res.json();
                toast.error("Erro: " + (err.error?.message || "Algo deu errado"));
            }
        } catch (err) {
            toast.error("Erro de conexão");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

        const res = await fetch(`/api/crm/services/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success("Serviço removido");
            loadServices();
        } else {
            toast.error("Erro ao excluir.");
        }
    };

    const filteredServices = (services || []).filter(s =>
        (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <PageHeader
                title="Catálogo de Serviços"
                subtitle="Gerencie seu menu de experiências e defina preços e durações."
                actions={
                    <Button onClick={() => setEditingService({ name: '', category: '', duration: 30, price: 0, imageUrl: '', active: true })} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Serviço
                    </Button>
                }
            />

            {/* Filters Bar */}
            <Card padding="p-6" className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou categoria..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtros
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-32 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Carregando catálogo...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white border border-dashed border-zinc-200 rounded-[3rem]">
                        <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <TagIcon className="w-8 h-8 text-zinc-200" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Nenhum serviço encontrado</h3>
                        <p className="text-zinc-500 font-medium max-w-xs mx-auto">Tente mudar os filtros ou cadastre um novo serviço para começar.</p>
                    </div>
                ) : filteredServices.map(service => (
                    <Card key={service.id} padding="p-0" className="group overflow-hidden flex flex-col hover:border-indigo-200 transition-all">
                        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 border-b border-zinc-50">
                            {service.imageUrl ? (
                                <img src={service.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={service.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-zinc-200" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <Badge variant={service.active ? "success" : "danger"}>
                                    {service.active ? 'No Ar' : 'Pausado'}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-6 flex-1">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{service.name}</h3>
                                    <button className="p-2 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="indigo" className="px-2 py-0">{service.category || 'Geral'}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Clock className="w-4 h-4 text-zinc-300" />
                                        <span className="text-xs font-black uppercase tracking-widest">{service.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-900">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">R$</span>
                                        <span className="text-xl font-black tracking-tighter">{parseFloat(service.price || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setEditingService(service)}
                                    variant="secondary"
                                    className="flex-1 rounded-xl py-3"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(service.id)}
                                    variant="danger"
                                    className="px-4 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal de Edição */}
            {editingService && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <Card padding="p-0" className="w-full max-w-2xl my-auto animate-in zoom-in duration-300 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
                        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{editingService.id ? 'Refinar Serviço' : 'Novo Serviço'}</h3>
                                <p className="text-sm text-zinc-500 font-medium">Defina os detalhes da experiência para seus clientes.</p>
                            </div>
                            <button onClick={() => setEditingService(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Nome do Serviço"
                                        required
                                        value={editingService.name}
                                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                                        placeholder="Ex: Extensão de Cílios Volume Russo"
                                    />
                                </div>
                                <Input
                                    label="Categoria"
                                    value={editingService.category}
                                    onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                                    placeholder="Ex: Cílios"
                                />
                                <Input
                                    label="Duração (Minutos)"
                                    type="number"
                                    required
                                    value={editingService.duration}
                                    onChange={e => setEditingService({ ...editingService, duration: parseInt(e.target.value) || 0 })}
                                />
                                <Input
                                    label="Preço Comercial (R$)"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={editingService.price}
                                    onChange={e => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                                />
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Visibilidade</label>
                                    <select
                                        value={editingService.active}
                                        onChange={e => setEditingService({ ...editingService, active: e.target.value === 'true' })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    >
                                        <option value="true">Ativo (No site)</option>
                                        <option value="false">Pausado (Interno)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="URL da Foto do Procedimento"
                                        value={editingService.imageUrl}
                                        onChange={e => setEditingService({ ...editingService, imageUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {editingService.imageUrl && (
                                        <div className="mt-4 h-40 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                                            <img src={editingService.imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 rounded-[1.5rem]"
                                loading={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {editingService.id ? 'Salvar Alterações' : 'Publicar Serviço'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
