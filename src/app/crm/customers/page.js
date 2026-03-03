"use client";
import { useEffect, useState } from 'react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/crm/customers')
            .then(res => res.json())
            .then(data => {
                setCustomers(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2">Clientes</h1>
                    <p className="text-zinc-500">Base de clientes e histórico de fidelidade.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">Novo Cliente</button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Nome</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Contato</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Faltas</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Tags</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">Carregando...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">Nenhum cliente cadastrado.</td></tr>
                        ) : customers.map(customer => (
                            <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold">{customer.name}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{customer.phone}</div>
                                    <div className="text-xs text-zinc-400">{customer.email || 'Sem e-mail'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.noShows > 2 ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {customer.noShows} no-show
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {customer.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase">{tag}</span>
                                        ))}
                                        {customer.tags.length === 0 && <span className="text-zinc-300 text-xs">-</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
