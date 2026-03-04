"use client";
import { useState, useEffect } from "react";
import { DateTime, Info } from "luxon";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    User,
    Search,
    Calendar as CalendarIcon,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { PageHeader } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 08:00 às 21:00

export default function CalendarPage() {
    const [viewDate, setViewDate] = useState(DateTime.now().startOf('week'));
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const weekDays = Array.from({ length: 7 }, (_, i) => viewDate.plus({ days: i }));

    useEffect(() => {
        loadEvents();
    }, [viewDate]);

    async function loadEvents() {
        setLoading(true);
        try {
            const start = viewDate.toISODate();
            const end = viewDate.endOf('week').toISODate();
            const res = await fetch(`/api/crm/appointments?start=${start}&end=${end}`);
            const data = await res.json();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }

    const nextWeek = () => setViewDate(prev => prev.plus({ weeks: 1 }));
    const prevWeek = () => setViewDate(prev => prev.minus({ weeks: 1 }));
    const goToToday = () => setViewDate(DateTime.now().startOf('week'));

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-8rem)] flex flex-col">
            <PageHeader
                title="Agenda Semanal"
                subtitle="Visualize e organize seus horários com rapidez."
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white border border-zinc-200 rounded-2xl p-1 shadow-sm">
                            <button onClick={prevWeek} className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-500"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={goToToday} className="px-4 text-xs font-black uppercase tracking-widest text-zinc-900 border-x border-zinc-100 hover:bg-zinc-50 transition-all">Hoje</button>
                            <button onClick={nextWeek} className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-500"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Horário
                        </Button>
                    </div>
                }
            />

            <Card padding="p-0" className="flex-1 flex flex-col overflow-hidden border-zinc-200/60 shadow-2xl shadow-zinc-200/20">
                {/* Calendar Header */}
                <div className="flex border-b border-zinc-100 bg-zinc-50/30">
                    <div className="w-20 border-r border-zinc-100" />
                    {weekDays.map(day => {
                        const isToday = day.hasSame(DateTime.now(), 'day');
                        return (
                            <div key={day.toISODate()} className="flex-1 p-6 text-center border-r border-zinc-100 last:border-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{day.setLocale('pt-BR').toFormat('ccc')}</p>
                                <div className={cn(
                                    "w-12 h-12 flex items-center justify-center rounded-2xl mx-auto text-xl font-black transition-all",
                                    isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : "text-zinc-900"
                                )}>
                                    {day.day}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="flex min-h-full">
                        {/* Time Column */}
                        <div className="w-20 bg-zinc-50/50 border-r border-zinc-100 shrink-0">
                            {HOURS.map(hour => (
                                <div key={hour} className="h-32 p-4 text-right border-b border-zinc-100/50">
                                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="flex-1 flex divide-x divide-zinc-100 relative">
                            {weekDays.map(day => (
                                <div key={day.toISODate()} className="flex-1 relative group">
                                    {HOURS.map(hour => (
                                        <div key={hour} className="h-32 border-b border-zinc-50 group-hover:bg-zinc-50/20 transition-colors" />
                                    ))}

                                    {/* Appointments Overlay */}
                                    {appointments.filter(a => DateTime.fromISO(a.startTime).hasSame(day, 'day')).map(app => {
                                        const start = DateTime.fromISO(app.startTime);
                                        const hour = start.hour;
                                        const minute = start.minute;

                                        // Cálculo simples de posição
                                        const top = (hour - 8) * 128 + (minute / 60) * 128;
                                        const duration = app.service.duration || 60;
                                        const height = (duration / 60) * 128;

                                        return (
                                            <div
                                                key={app.id}
                                                style={{ top: `${top}px`, height: `${height}px` }}
                                                className="absolute inset-x-1 p-3 bg-white border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-100/20 hover:scale-[1.02] hover:z-10 transition-all cursor-pointer group/item overflow-hidden"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">{start.toFormat('HH:mm')}</span>
                                                    <Badge variant="indigo" className="px-1.5 py-0 text-[8px]">{app.status}</Badge>
                                                </div>
                                                <h4 className="text-xs font-black text-zinc-900 truncate uppercase tracking-tight">{app.customer.name}</h4>
                                                <p className="text-[9px] font-bold text-zinc-400 truncate mt-1">{app.service.name}</p>

                                                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-zinc-50 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <div className="w-5 h-5 bg-zinc-100 rounded-lg flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">
                                                        {app.staff.name[0]}
                                                    </div>
                                                    <span className="text-[9px] font-black text-zinc-400 uppercase">{app.staff.name.split(' ')[0]}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </Card>

            {/* Calendar Footer Info */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Confirmado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pendente</span>
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Dica: Clique em um espaço vazio para agendar rapidamente</p>
            </div>
        </div>
    );
}
