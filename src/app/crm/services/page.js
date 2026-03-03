"use client";
import { useEffect, useState } from 'react';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/crm/services')
            .then(res => res.json())
            .then(data => {
                setServices(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2">Serviços</h1>
                    <p className="text-zinc-500">Gerencie o catálogo de serviços do seu salão.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">Novo Serviço</button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Nome</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Categoria</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Duração</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Preço</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-400">Carregando...</td></tr>
                        ) : services.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-400">Nenhum serviço cadastrado.</td></tr>
                        ) : services.map(service => (
                            <tr key={service.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold">{service.name}</td>
                                <td className="px-6 py-4 text-zinc-500">{service.category || '-'}</td>
                                <td className="px-6 py-4 text-zinc-500">{service.duration} min</td>
                                <td className="px-6 py-4 font-medium">R$ {parseFloat(service.price).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${service.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {service.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
