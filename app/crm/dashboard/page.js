"use client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
    TrendingUp,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertTriangle,
    Navigation,
    Download,
    Plus,
    Clock,
    User,
    MoreVertical
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { cn } from "@/lib/utils";

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
        revenue: appointments.reduce((acc, app) => acc + (app.status !== 'CANCELED' ? Number(app.service?.price || 0) : 0), 0),
        count: appointments.length,
        confirmed: appointments.filter(a => ['CONFIRMED', 'DONE'].includes(a.status)).length,
        noShows: appointments.filter(a => a.status === 'NO_SHOW').length,
    };

    const confirmationRate = stats.count > 0 ? Math.round((stats.confirmed / stats.count) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <PageHeader
                title="Visão Geral"
                subtitle={DateTime.fromISO(date).setLocale("pt-BR").toLocaleString(DateTime.DATE_HUGE)}
                actions={
                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-white border border-zinc-200 pl-12 pr-6 py-4 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
                            />
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                        </div>
                        <Button
                            onClick={() => window.location.href = '/crm/calendar'}
                            className="gap-2 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4 pointer-events-none" />
                            Agendar
                        </Button>
                    </div>
                }
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Faturamento', value: `R$ ${stats.revenue.toFixed(2)}`, color: 'indigo', icon: TrendingUp },
                    { label: 'Agendamentos', value: stats.count, color: 'zinc', icon: CalendarIcon },
                    { label: 'Confirmação', value: `${confirmationRate}%`, color: 'green', icon: CheckCircle2 },
                    { label: 'No-Shows', value: stats.noShows, color: 'red', icon: AlertTriangle },
                ].map((stat, i) => (
                    <Card key={i} className="flex items-center gap-6 group hover:border-indigo-200 transition-all">
                        <div className={cn(
                            "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-colors shadow-sm",
                            stat.color === 'indigo' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                            stat.color === 'red' && "bg-red-50 text-red-600",
                            stat.color === 'green' && "bg-green-50 text-green-600",
                            stat.color === 'zinc' && "bg-zinc-50 text-zinc-600",
                        )}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-zinc-900">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card padding="p-0 overflow-hidden">
                <div className="p-10 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/20">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight">Agenda do Dia</h2>
                    </div>
                    <Button
                        onClick={() => toast.success("Relatório sendo gerado...")}
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <Download className="w-4 h-4 pointer-events-none" />
                        Exportar Relatório
                    </Button>
                </div>

                <div className="divide-y divide-zinc-50">
                    {loading ? (
                        <div className="py-24 text-center">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-zinc-400 font-bold uppercase tracking-widest italic animate-pulse">Sincronizando agenda...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-zinc-100 shadow-inner">
                                <CalendarIcon className="w-10 h-10 text-zinc-200" />
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 mb-2">Um dia tranquilo à frente</h3>
                            <p className="text-zinc-500 font-medium max-w-xs mx-auto">Não há agendamentos para esta data. Que tal abrir novos horários ou entrar em contato com clientes?</p>
                            <Button
                                onClick={() => window.location.href = '/crm/settings'}
                                variant="outline"
                                className="mt-8"
                            >
                                Abrir Agenda
                            </Button>
                        </div>
                    ) : (
                        appointments.map((app) => (
                            <div key={app.id} className="group flex items-center p-8 hover:bg-zinc-50/50 transition-all relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />

                                <div className="w-40 border-r border-zinc-100 pr-10 shrink-0">
                                    <div className="flex items-center gap-2 text-zinc-900 font-black text-2xl mb-1">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                        {DateTime.fromISO(app.startTime).toFormat("HH:mm")}
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Início do atendimento</p>
                                </div>

                                <div className="flex-1 px-10">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h3 className="font-black text-xl text-zinc-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{app.customer.name}</h3>
                                        <div className="flex gap-2">
                                            {app.customer.tags?.includes('VIP') && <Badge variant="indigo">VIP</Badge>}
                                            {app.customer.noShows > 1 && <Badge variant="danger">Alto Risco</Badge>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                                            <div className="w-3 h-3 rounded-full bg-indigo-400" />
                                            {app.service.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                            <User className="w-4 h-4" />
                                            {app.staff.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-zinc-900 mb-0.5">R$ {parseFloat(app.service.price).toFixed(2)}</div>
                                        <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Procedimento</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={`https://wa.me/${app.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${app.customer.name}! Sou do Studio Josy Silva e gostaria de confirmar seu horário hoje às ${DateTime.fromISO(app.startTime).toFormat("HH:mm")}.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-14 h-14 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </a>
                                        <button
                                            onClick={() => toast.success("Ações extras em breve...")}
                                            className="w-14 h-14 flex items-center justify-center bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-zinc-100 transition-all border border-zinc-100 active:scale-95"
                                        >
                                            <MoreVertical className="w-5 h-5 pointer-events-none" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
