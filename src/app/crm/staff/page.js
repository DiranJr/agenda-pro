"use client";
import { useEffect, useState } from 'react';

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/crm/staff')
            .then(res => res.json())
            .then(data => {
                setStaff(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2">Profissionais</h1>
                    <p className="text-zinc-500">Equipe e especialistas do seu salão.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">Novo Profissional</button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Nome</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Telefone</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Unidade</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">Carregando...</td></tr>
                        ) : staff.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">Nenhum profissional cadastrado.</td></tr>
                        ) : staff.map(member => (
                            <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold">{member.name}</td>
                                <td className="px-6 py-4 text-zinc-500">{member.phone || '-'}</td>
                                <td className="px-6 py-4 text-zinc-500">{member.location?.name || 'Padrão'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                        {member.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
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
