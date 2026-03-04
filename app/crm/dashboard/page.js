"use client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function DashboardPage() {
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAppointments() {
            setLoading(true);
            try {
                const res = await fetch(`/api/crm/appointments?date=${date}`);
                const data = await res.json();
                setAppointments(Array.isArray(data) ? data : []);
            } catch (err) {
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, [date]);

    const stats = {
        revenue: appointments.reduce((acc, app) => acc + (app.status !== 'CANCELED' ? Number(app.service.price) : 0), 0),
        count: appointments.length,
        confirmed: appointments.filter(a => ['CONFIRMED', 'DONE'].includes(a.status)).length,
        noShows: appointments.filter(a => a.status === 'NO_SHOW').length,
    };

    const confirmationRate = stats.count > 0 ? Math.round((stats.confirmed / stats.count) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Painel Estratégico</h1>
                    <p className="text-zinc-500 font-medium text-lg italic">
                        {DateTime.fromISO(date).setLocale("pt-BR").toLocaleString(DateTime.DATE_HUGE)}
                    </p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white border border-zinc-200 px-6 py-3 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all shadow-sm"
                    />
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Faturamento Previsto', value: `R$ ${stats.revenue.toFixed(2)}`, color: 'text-zinc-900', icon: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
                    { label: 'Agendamentos', value: stats.count, color: 'text-zinc-900', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
                    { label: 'Taxa de Confirmação', value: `${confirmationRate}%`, color: 'text-indigo-600', icon: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z' },
                    { label: 'Risco de Falta', value: stats.noShows, color: 'text-red-500', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-50 ${stat.color.replace('text', 'text-opacity-20 text')}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${stat.color}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                            </svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</div>
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-zinc-200 rounded-[3rem] shadow-sm p-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-indigo-600"></span>
                        Agenda do Dia
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center animate-pulse text-zinc-400 font-bold uppercase tracking-widest italic">Sincronizando agenda...</div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-zinc-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        <p className="text-zinc-500 font-bold text-lg">Sem agendamentos para hoje.</p>
                        <p className="text-zinc-400 text-sm mt-1">Que tal abrir novos horários?</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((app) => (
                            <div key={app.id} className="group flex items-center p-8 border border-zinc-100 rounded-[2.5rem] hover:border-indigo-100 hover:bg-indigo-50/20 transition-all relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 opacity-0 group-hover:opacity-100"></div>

                                <div className="w-32 border-r border-zinc-100 pr-8 mr-8">
                                    <div className="text-2xl font-black text-zinc-900 leading-none mb-1">{DateTime.fromISO(app.startTime).toFormat("HH:mm")}</div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Início</div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-black text-xl text-zinc-900">{app.customer.name}</h3>
                                        <div className="flex gap-1">
                                            {app.customer.tags?.includes('VIP') && <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">VIP</span>}
                                            {app.customer.noShows > 1 && <span className="bg-red-50 text-red-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-red-100">Risco</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                            {app.service.name}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                                            {app.staff.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://wa.me/${app.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${app.customer.name}!`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </a>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-zinc-900 leading-none mb-1">R$ {parseFloat(app.service.price).toFixed(2)}</div>
                                        <div className="text-[10px] font-black uppercase text-zinc-400">Total</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
