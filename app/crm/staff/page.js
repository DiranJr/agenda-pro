"use client";
import { useEffect, useState } from 'react';

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
            setEditingMember(null);
            loadStaff();
        } else {
            const err = await res.json();
            alert("Erro: " + (err.error?.message || "Algo deu errado"));
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este profissional?")) return;

        const res = await fetch(`/api/crm/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadStaff();
        } else {
            alert("Erro ao excluir.");
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
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Equipe</h1>
                    <p className="text-zinc-500 font-medium text-lg">Gerencie os especialistas que fazem a mágica acontecer.</p>
                </div>
                <button
                    onClick={() => setEditingMember({ name: '', phone: '', status: 'ACTIVE', serviceIds: [] })}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Especialista
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Carregando equipe...</div>
                ) : staff.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-zinc-200 rounded-[2.5rem] text-zinc-400">
                        Nenhum profissional cadastrado. Comece agora!
                    </div>
                ) : staff.map(member => (
                    <div key={member.id} className="group bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full border-2 border-white shadow-md flex items-center justify-center text-2xl font-black text-zinc-300">
                                {member.name[0]}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-zinc-900 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                                <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mt-2 ${member.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-zinc-50 text-zinc-400 border-zinc-100'}`}>
                                    {member.status === 'ACTIVE' ? 'Disponível' : 'Indisponível'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-30">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                {member.phone || 'Sem telefone'}
                            </div>
                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                                {member.services?.length || 0} Serviços Habilitados
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingMember({ ...member, serviceIds: member.services?.map(s => s.serviceId) || [] })}
                                className="flex-1 py-4 bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-indigo-600 hover:text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
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

            {/* Modal de Edição Profissional */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm shadow-2xl overflow-y-auto">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl my-auto overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{editingMember.id ? 'Editar Especialista' : 'Novo Especialista'}</h3>
                                <p className="text-sm text-zinc-500 font-medium">Cadastre um novo talento e defina suas habilidades.</p>
                            </div>
                            <button onClick={() => setEditingMember(null)} className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Nome Completo</label>
                                    <input
                                        required
                                        value={editingMember.name}
                                        onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                        placeholder="Ex: João Silva"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Telefone / WhatsApp</label>
                                    <input
                                        required
                                        value={editingMember.phone}
                                        onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4 block ml-1">Serviços que realiza</label>
                                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2">
                                    {services.map(service => (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => toggleService(service.id)}
                                            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between group ${editingMember.serviceIds?.includes(service.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'}`}
                                        >
                                            <span className="text-sm font-bold">{service.name}</span>
                                            {editingMember.serviceIds?.includes(service.id) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-4">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block ml-1">Status de Disponibilidade</label>
                                <select
                                    value={editingMember.status}
                                    onChange={e => setEditingMember({ ...editingMember, status: e.target.value })}
                                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                                >
                                    <option value="ACTIVE">Ativo / Disponível</option>
                                    <option value="INACTIVE">Inativo / Pausado</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Sincronizando...' : 'Salvar Especialista'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
