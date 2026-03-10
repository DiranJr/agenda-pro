"use client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
    TrendingUp,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertCircle,
    Plus,
    Clock,
    User,
    Zap,
    Users,
    DollarSign,
    Target,
    ArrowUpRight,
    MessageCircle,
    Check,
    ChevronRight,
    Share2,
    ExternalLink,
    AlertTriangle,
    Scissors
} from "lucide-react";
import { toast } from "react-hot-toast";
import { PageHeader } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(DateTime.now());
    const [date, setDate] = useState(DateTime.now().toISODate());

    useEffect(() => {
        const timer = setInterval(() => setNow(DateTime.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const [statsRes, appRes] = await Promise.all([
                fetch('/api/crm/dashboard'),
                fetch(`/api/crm/appointments?date=${date}`)
            ]);

            const statsData = await statsRes.json();
            const appData = await appRes.json();

            setStats(statsData);
            setAppointments(Array.isArray(appData) ? appData : []);
        } catch (err) {
            console.error("Erro dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [date]);

    const getTimeGreeting = () => {
        const hour = now.hour;
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    const handleShare = () => {
        if (!stats?.slug) return;
        const url = `${window.location.origin}/${stats.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copiado para o WhatsApp!");
    };

    const handleCompleteAppointment = async (id) => {
        setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'DONE' } : app));
        toast.success("Atendimento concluído!");
        try {
            const res = await fetch(`/api/crm/appointments/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'DONE' }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
        } catch (e) {
            toast.error("Erro ao atualizar!");
            loadDashboard(); // revert on fail
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
            {/* Header com Saudação */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-3">
                        <Zap className="w-4 h-4" /> PERFORMANCE REALTIME
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight font-syne">
                        {getTimeGreeting()}, <span className="text-indigo-600">{stats?.adminName || 'Admin'}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-zinc-400 font-medium">{now.setLocale('pt-BR').toFormat("cccc, dd 'de' MMMM")}</p>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <p className="text-indigo-600 font-black tabular-nums">{now.toFormat("HH:mm:ss")}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-zinc-100">
                    <div className="relative">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-zinc-50 border-none pl-12 pr-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all cursor-pointer"
                        />
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <Button
                        onClick={() => window.location.href = '/crm/calendar'}
                        className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100 text-xs font-black uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(null).map((_, i) => (
                        <Card key={i} padding="p-8" className="animate-pulse flex flex-col justify-between h-[180px]">
                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl" />
                            <div className="space-y-3 mt-auto">
                                <div className="h-8 bg-zinc-100 rounded-lg w-1/2" />
                                <div className="h-4 bg-zinc-100 rounded-lg w-1/3" />
                            </div>
                        </Card>
                    ))
                ) : (
                    [
                        { label: 'Faturamento Hoje', value: `R$ ${(stats?.todayRevenue || 0).toFixed(2)}`, sub: 'Realizado', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Agendamentos', value: stats?.todayCount || 0, sub: 'Hoje', icon: CalendarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Taxa No-Show', value: `${stats?.noShowRate || 0}%`, sub: 'Este mês', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Captar Clientes', value: stats?.inactiveCount || 0, sub: 'Inativos +60d', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <Card key={i} padding="p-8" className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10 space-y-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-zinc-900 leading-none mt-1 font-syne">{stat.value}</h3>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 block">{stat.sub}</span>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Agenda e Gráfico */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Próximo Atendimento (Destaque) */}
                    {stats?.nextAppointment && (
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest px-2">Próximo Atendimento</h2>
                            <Card padding="p-0 overflow-hidden bg-indigo-600 text-white shadow-2xl shadow-indigo-200 border-none group relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[8rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                                <div className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
                                    <div className="text-center md:text-left space-y-2">
                                        <div className="text-5xl font-black tracking-tighter font-syne italic">
                                            {DateTime.fromISO(stats.nextAppointment.startTime).toFormat("HH:mm")}
                                        </div>
                                        <Badge variant="zinc" className="bg-white/20 text-white border-none py-1.5 px-3">EM BREVE</Badge>
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <h3 className="text-3xl font-black uppercase tracking-tight">{stats.nextAppointment.customer.name}</h3>
                                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-2"><Scissors className="w-4 h-4" /> {stats.nextAppointment.service.name}</span>
                                            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {stats.nextAppointment.staff.name}</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => window.location.href = '/crm/customers'} className="bg-white text-indigo-600 hover:bg-zinc-100 rounded-2xl h-16 px-10 font-black shadow-xl shrink-0">
                                        VER FICHA
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Gráfico de 7 Dias */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3 font-syne italic">
                                <TrendingUp className="w-5 h-5 text-indigo-600" /> Faturamento Semanal
                            </h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Últimos 7 dias</span>
                        </div>
                        <Card padding="p-8">
                            <div className="h-72 w-full">
                                {stats?.chartData && stats.chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={stats.chartData}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 900 }}
                                                dy={10}
                                                tickFormatter={(str) => DateTime.fromISO(str).toFormat('dd/MM')}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 900 }}
                                                tickFormatter={(val) => `R$${val}`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-2xl border border-zinc-800">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                                                                    {DateTime.fromISO(payload[0].payload.date).toFormat("dd 'de' MMMM")}
                                                                </p>
                                                                <p className="text-sm font-black text-indigo-400">
                                                                    R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                radius={[8, 8, 8, 8]}
                                                barSize={40}
                                            >
                                                {stats.chartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.value === Math.max(...stats.chartData.map(d => d.value)) ? '#6366f1' : '#f4f4f5'}
                                                        className="hover:fill-indigo-400 transition-colors duration-300"
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <TrendingUp className="w-12 h-12 text-zinc-100 mb-4" />
                                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Sem dados suficientes para gerar o gráfico</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Agenda Timeline */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2 text-syne">
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                                <Clock className="w-5 h-5 text-indigo-600" /> Agenda do Dia
                            </h2>
                            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Ver Calendário Completo</button>
                        </div>
                        <Card padding="p-0 overflow-hidden">
                            <div className="divide-y divide-zinc-50">
                                {loading ? (
                                    <div className="py-24 text-center">
                                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-zinc-400 font-bold uppercase tracking-widest italic animate-pulse text-xs">Sincronizando...</p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-center p-10">
                                        <div className="w-20 h-20 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-zinc-100">
                                            <CalendarIcon className="w-8 h-8 text-zinc-200" />
                                        </div>
                                        <h3 className="text-lg font-black text-zinc-900 font-syne">Nenhum agendamento para hoje</h3>
                                        <p className="text-zinc-400 text-sm font-medium mt-2 max-w-[240px]">Compartilhe seu link para atrair mais clientes.</p>
                                        <Button onClick={handleShare} variant="outline" className="mt-6 gap-2 border-zinc-200">
                                            <Share2 className="w-4 h-4" /> Copiar Link Site
                                        </Button>
                                    </div>
                                ) : (
                                    appointments.map((app) => (
                                        <div key={app.id} className="group flex flex-col md:flex-row md:items-center p-8 hover:bg-zinc-50/50 transition-all relative gap-6">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                                            <div className="w-32 shrink-0">
                                                <div className="text-2xl font-black text-zinc-900">{DateTime.fromISO(app.startTime).toFormat("HH:mm")}</div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Check-in</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-xl text-zinc-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{app.customer.name}</h3>
                                                    <Badge variant={app.status === 'DONE' ? 'success' : 'indigo'} className="h-5 px-2 text-[9px]">{app.status}</Badge>
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> {app.service.name}</span>
                                                    <span className="flex items-center gap-2"><User className="w-3 h-3" /> {app.staff.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-zinc-900">R$ {parseFloat(app.service.price).toFixed(2)}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleCompleteAppointment(app.id)}
                                                        className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-10">
                    {/* Share Card */}
                    <Card padding="p-8" className="bg-zinc-900 text-white border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[60px] opacity-20 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white font-syne italic">Sua Vitrine Online</h3>
                                <p className="text-zinc-500 text-xs mt-1">Envie o link do seu site para os clientes agendarem sozinhos.</p>
                            </div>
                            <Button onClick={handleShare} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40">
                                COMPARTILHAR SITE
                            </Button>
                        </div>
                    </Card>

                    {/* Alerts / Tasks */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest px-2">Ações Sugeridas</h2>
                        <div className="grid gap-4">
                            {[
                                ...(stats?.noShowRate > 0 ? [{ title: 'Faltas Identificadas', desc: `Sua taxa de falta está em ${stats.noShowRate}% este mês.`, action: 'Analisar', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' }] : []),
                                ...(stats?.inactiveCount > 0 ? [{ title: 'Recuperar Clientes', desc: `${stats.inactiveCount} inativos há +60 dias.`, action: 'Contatar', icon: MessageCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' }] : []),
                                ...((stats?.noShowRate === 0 && stats?.inactiveCount === 0) ? [{ title: 'Tudo perfeito!', desc: 'Sua operação está rodando sem problemas.', action: 'Ver Calendário', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' }] : [])
                            ].map((item, i) => (
                                <Card key={i} padding="p-6" className="flex items-start gap-4 hover:border-indigo-100 transition-all cursor-pointer">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-[10px] text-zinc-400 font-bold mt-1">{item.desc}</p>
                                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-3 hover:underline">{item.action}</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
