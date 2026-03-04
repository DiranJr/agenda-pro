"use client";
import { useEffect, useState } from 'react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [saving, setSaving] = useState(false);

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

        // Tratar tags como string separada por vírgula no input mas array no JSON
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
            setEditingCustomer(null);
            loadCustomers();
        } else {
            const err = await res.json();
            alert("Erro: " + (err.error?.message || "Algo deu errado"));
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este cliente? Isso apagará seu histórico.")) return;

        const res = await fetch(`/api/crm/customers/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadCustomers();
        } else {
            alert("Erro ao excluir.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Clientes</h1>
                    <p className="text-zinc-500 font-medium text-lg">Base de dados e histórico de fidelidade.</p>
                </div>
                <button
                    onClick={() => setEditingCustomer({ name: '', phone: '', email: '', noShows: 0, tags: '' })}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Cliente
                </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[3rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50/50 border-b border-zinc-100">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Cliente</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Contato</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">No-Shows</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tags</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr><td colSpan="5" className="px-8 py-20 text-center text-zinc-400 font-bold animate-pulse">Consultando base de dados...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="5" className="px-8 py-20 text-center text-zinc-400">Nenhum cliente cadastrado.</td></tr>
                        ) : customers.map(customer => (
                            <tr key={customer.id} className="hover:bg-zinc-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-sm font-black text-zinc-300">
                                            {customer.name[0]}
                                        </div>
                                        <div className="font-black text-zinc-900">{customer.name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-bold text-zinc-700">{customer.phone}</div>
                                        <div className="text-[10px] text-zinc-400">{customer.email || 'Sem e-mail'}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.noShows > 1 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-50 text-zinc-400'}`}>
                                        {customer.noShows} faltas
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-1 flex-wrap">
                                        {customer.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-tighter border border-indigo-100">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingCustomer({ ...customer, tags: customer.tags.join(', ') })}
                                            className="p-2 border border-zinc-100 rounded-xl hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="p-2 border border-zinc-100 rounded-xl hover:bg-white hover:border-red-600 hover:text-red-600 transition-all shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Cliente */}
            {editingCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{editingCustomer.id ? 'Ficha do Cliente' : 'Novo Cliente'}</h3>
                                <p className="text-sm text-zinc-500 font-medium">Informações de contato e fidelidade.</p>
                            </div>
                            <button onClick={() => setEditingCustomer(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Nome Completo</label>
                                <input
                                    required
                                    value={editingCustomer.name}
                                    onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    placeholder="Ex: Maria Oliveira"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">WhatsApp</label>
                                    <input
                                        required
                                        value={editingCustomer.phone}
                                        onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">No-Shows</label>
                                    <input
                                        type="number"
                                        value={editingCustomer.noShows}
                                        onChange={e => setEditingCustomer({ ...editingCustomer, noShows: parseInt(e.target.value) || 0 })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Email</label>
                                <input
                                    type="email"
                                    value={editingCustomer.email}
                                    onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    placeholder="exemplo@email.com"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Tags (separadas por vírgula)</label>
                                <input
                                    value={editingCustomer.tags}
                                    onChange={e => setEditingCustomer({ ...editingCustomer, tags: e.target.value })}
                                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    placeholder="VIP, Frequent, Recorrente"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 mt-4"
                            >
                                {saving ? 'Sincronizando...' : 'Salvar Alterações'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
