"use client";
import { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    User,
    Mail,
    Phone,
    AlertCircle,
    MoreVertical,
    Filter,
    ArrowUpDown,
    X
} from "lucide-react";
import { PageHeader, Input, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        setLoading(true);
        fetch('/api/crm/customers')
            .then(res => res.json())
            .then(data => {
                setCustomers(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const method = editingCustomer.id ? 'PATCH' : 'POST';
        const url = editingCustomer.id ? `/api/crm/customers/${editingCustomer.id}` : '/api/crm/customers';

        const payload = {
            ...editingCustomer,
            tags: typeof editingCustomer.tags === 'string'
                ? editingCustomer.tags.split(',').map(t => t.trim()).filter(t => t)
                : editingCustomer.tags
        };

        const res = await fetch(url, {
            method,
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.success(editingCustomer.id ? "Cadastro atualizado!" : "Cliente cadastrado com sucesso!");
            setEditingCustomer(null);
            loadCustomers();
        } else {
            const err = await res.json();
            toast.error("Erro: " + (err.error?.message || "Algo deu errado"));
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este cliente? Isso apagará seu histórico.")) return;

        const res = await fetch(`/api/crm/customers/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success("Cliente removido da base.");
            loadCustomers();
        } else {
            toast.error("Erro ao excluir.");
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <PageHeader
                title="Gestão de Clientes"
                subtitle="Acompanhe o histórico, fidelidade e contatos da sua base."
                actions={
                    <Button onClick={() => setEditingCustomer({ name: '', phone: '', email: '', noShows: 0, tags: '' })} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </Button>
                }
            />

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total de Clientes', value: customers.length, icon: User },
                    { label: 'Fidelidade Alta', value: customers.filter(c => c.tags.includes('VIP')).length, icon: ArrowUpDown },
                    { label: 'Risco de Evasão', value: customers.filter(c => c.noShows > 1).length, icon: AlertCircle },
                ].map((stat, i) => (
                    <Card key={i} padding="p-6" className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">{stat.label}</p>
                            <p className="text-xl font-black text-zinc-900">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card padding="p-0 overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-50/10">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, fone ou e-mail..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-zinc-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
                        />
                    </div>
                    <Button variant="outline" className="gap-2 w-full md:w-auto">
                        <Filter className="w-4 h-4" />
                        Filtros Avançados
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Identificação</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fidelidade</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">No-Shows</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-20 text-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                                            <Search className="w-8 h-8 text-zinc-200" />
                                        </div>
                                        <p className="text-zinc-400 font-bold">Nenhum cliente encontrado.</p>
                                    </td>
                                </tr>
                            ) : filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-sm font-black text-zinc-400 shadow-sm border border-white">
                                                {customer.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-zinc-900 uppercase tracking-tight">{customer.name}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                        <Phone className="w-3 h-3" />
                                                        {customer.phone}
                                                    </span>
                                                    {customer.email && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                            <Mail className="w-3 h-3" />
                                                            {customer.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-1 flex-wrap">
                                            {customer.tags.length > 0 ? customer.tags.map(tag => (
                                                <Badge key={tag} variant="indigo" className="px-2 py-0 border-none bg-indigo-50/50">{tag}</Badge>
                                            )) : <span className="text-[10px] text-zinc-300 font-bold uppercase italic">Sem tags</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                            customer.noShows > 1 ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-400"
                                        )}>
                                            {customer.noShows > 1 && <AlertCircle className="w-3 h-3" />}
                                            {customer.noShows} faltas
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-10 h-10 p-0 rounded-xl"
                                                onClick={() => setEditingCustomer({ ...customer, tags: customer.tags.join(', ') })}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-10 h-10 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-100"
                                                onClick={() => handleDelete(customer.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal de Cliente */}
            {editingCustomer && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <Card padding="p-0" className="w-full max-w-lg my-auto animate-in zoom-in duration-300 overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-300">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{editingCustomer.id ? 'Perfil do Cliente' : 'Novo Registro'}</h3>
                                    <p className="text-sm text-zinc-500 font-medium">Contatos e inteligência de fidelidade.</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingCustomer(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8">
                            <Input
                                label="Nome Completo"
                                required
                                value={editingCustomer.name}
                                onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                                placeholder="Ex: Maria Oliveira"
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Fone / WhatsApp"
                                    required
                                    value={editingCustomer.phone}
                                    onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                />
                                <Input
                                    label="Faltas (No-Shows)"
                                    type="number"
                                    value={editingCustomer.noShows}
                                    onChange={e => setEditingCustomer({ ...editingCustomer, noShows: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <Input
                                label="E-mail"
                                type="email"
                                value={editingCustomer.email}
                                onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                                placeholder="exemplo@email.com"
                            />

                            <Input
                                label="Tags de Fidelidade (vibrante separar por vírgula)"
                                value={editingCustomer.tags}
                                onChange={e => setEditingCustomer({ ...editingCustomer, tags: e.target.value })}
                                placeholder="VIP, Recorrente, Amigo"
                            />

                            <Button
                                type="submit"
                                className="w-full py-6 rounded-3xl"
                                loading={saving}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {editingCustomer.id ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
