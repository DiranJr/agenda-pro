"use client";
import { useEffect, useState } from 'react';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [saving, setSaving] = useState(false);

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

        const res = await fetch(url, {
            method,
            body: JSON.stringify(editingService),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            setEditingService(null);
            loadServices();
        } else {
            const err = await res.json();
            alert("Erro: " + (err.error?.message || "Algo deu errado"));
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

        const res = await fetch(`/api/crm/services/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadServices();
        } else {
            alert("Erro ao excluir.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Serviços</h1>
                    <p className="text-zinc-500 font-medium text-lg">Gerencie o seu menu de experiências e beleza.</p>
                </div>
                <button
                    onClick={() => setEditingService({ name: '', category: '', duration: 30, price: 0, imageUrl: '', active: true })}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Cadastrar Novo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Carregando catálogo...</div>
                ) : services.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-zinc-200 rounded-[2.5rem] text-zinc-400">
                        Nenhum serviço encontrado. Comece cadastrando um acima!
                    </div>
                ) : services.map(service => (
                    <div key={service.id} className="group bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-100 mb-6 border border-zinc-50 shadow-inner">
                            {service.imageUrl ? (
                                <img src={service.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={service.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 opacity-30">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75A1.5 1.5 0 0 0 22.5 5.25H2.25A1.5 1.5 0 0 0 .75 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${service.active ? 'bg-green-500/10 text-green-600 border border-green-200' : 'bg-red-500/10 text-red-600 border border-red-200'}`}>
                                    {service.active ? 'Ativo' : 'Pausado'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1">{service.category || 'Sem Categoria'}</div>
                            <h3 className="text-xl font-black text-zinc-900 line-clamp-1">{service.name}</h3>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-zinc-600">{service.duration} min</span>
                            </div>
                            <div className="text-2xl font-black text-zinc-900 tracking-tighter">
                                R$ {parseFloat(service.price).toFixed(2)}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingService(service)}
                                className="flex-1 py-4 border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-indigo-600 hover:text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Editar Detalhes
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="px-4 bg-white border border-zinc-100 hover:border-red-600 hover:text-red-600 rounded-2xl transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Edição */}
            {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{editingService.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                                <p className="text-sm text-zinc-500 font-medium">Preencha as informações do novo procedimento.</p>
                            </div>
                            <button onClick={() => setEditingService(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Nome do Serviço</label>
                                    <input
                                        required
                                        value={editingService.name}
                                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                        placeholder="Ex: Extensão de Cílios Volume Russo"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Categoria</label>
                                    <input
                                        value={editingService.category}
                                        onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                        placeholder="Ex: Cílios"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Duração (Min)</label>
                                    <input
                                        type="number"
                                        required
                                        value={editingService.duration}
                                        onChange={e => setEditingService({ ...editingService, duration: parseInt(e.target.value) || 0 })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editingService.price}
                                        onChange={e => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Ativo</label>
                                    <select
                                        value={editingService.active}
                                        onChange={e => setEditingService({ ...editingService, active: e.target.value === 'true' })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                    >
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">URL da Foto</label>
                                    <div className="flex gap-4">
                                        <input
                                            value={editingService.imageUrl}
                                            onChange={e => setEditingService({ ...editingService, imageUrl: e.target.value })}
                                            className="flex-1 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                        {editingService.imageUrl && (
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                                <img src={editingService.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 mt-4"
                            >
                                {saving ? 'Salvando...' : 'Salvar Informações'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
