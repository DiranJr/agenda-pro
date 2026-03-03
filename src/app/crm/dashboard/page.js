"use client";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

export default function DashboardPage() {
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [appointments, setAppointments] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar profissionais primeiro para o cabeçalho da agenda
        fetch('/api/crm/staff')
            .then(res => res.json())
            .then(data => setStaffList(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/crm/appointments?date=${date}`)
            .then(res => res.json())
            .then(data => {
                setAppointments(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, [date]);

    const statusColors = {
        SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-100',
        CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        DONE: 'bg-green-50 text-green-700 border-green-100',
        CANCELED: 'bg-red-50 text-red-700 border-red-100',
        NO_SHOW: 'bg-zinc-50 text-zinc-700 border-zinc-100',
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2">Agenda</h1>
                    <p className="text-zinc-500">Hoje é {DateTime.fromISO(date).setLocale('pt-BR').toLocaleString(DateTime.DATE_HUGE)}</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white border border-zinc-200 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5"
                    />
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Novo Agendamento</button>
                </div>
            </div>

            {/* Grid da Agenda (Simplificado por enquanto) */}
            <div className="flex-1 overflow-auto bg-white border border-zinc-200 rounded-3xl shadow-sm p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-zinc-400 font-medium">Carregando agendamentos...</div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-zinc-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        <p className="text-zinc-500 font-medium">Nenhum agendamento para este dia.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {appointments.map(app => (
                            <div key={app.id} className="flex items-center p-6 border border-zinc-100 rounded-2xl hover:border-zinc-200 hover:shadow-sm transition-all group">
                                <div className="w-24 border-r border-zinc-50 mr-6 pr-6">
                                    <div className="text-lg font-black">{DateTime.fromISO(app.startTime).toFormat('HH:mm')}</div>
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Início</div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{app.customer.name}</h3>
                                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-300">
                                                <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                            </svg>
                                            {app.service.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-300">
                                                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                                            </svg>
                                            {app.staff.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${statusColors[app.status]}`}>
                                        {app.status}
                                    </span>
                                    <div className="text-xs font-bold text-zinc-400">
                                        Fim: {DateTime.fromISO(app.endTime).toFormat('HH:mm')}
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
