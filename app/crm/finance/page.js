"use client";
import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar as CalendarIcon,
    Users,
    Scissors,
    Wallet,
    ArrowRight,
    Plus,
    Target,
    Award,
    FileSpreadsheet,
    ChevronDown
} from "lucide-react";
import { PageHeader, Input, Select } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(DateTime.now().startOf('month').toISODate());
    const [endDate, setEndDate] = useState(DateTime.now().endOf('month').toISODate());
    const [report, setReport] = useState(null);

    const loadReport = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/crm/finance?startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            setReport(data);
        } catch (err) {
            toast.error("Erro ao carregar relatório financeiro.");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const handleExport = () => {
        // Implementar export CSV simples
        const headers = ["Data", "Cliente", "Serviço", "Profissional", "Valor", "Status"];
        const rows = report.appointments.map(a => [
            DateTime.fromISO(a.startTime).toFormat('dd/MM/yyyy HH:mm'),
            a.customer.name,
            a.service.name,
            a.staff.name,
            a.service.price,
            a.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `relatorio_financeiro_${startDate}_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading && !report) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Calculando balanço financeiro...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <PageHeader
                title="Performance Financeira"
                subtitle="Análise detalhada de faturamento, ticket médio e produtividade."
                actions={
                    <div className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 px-4 border-r border-zinc-100">
                            <CalendarIcon className="w-4 h-4 text-zinc-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black uppercase outline-none"
                            />
                            <span className="text-zinc-300">/</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black uppercase outline-none"
                            />
                        </div>
                        <Button
                            onClick={handleExport}
                            variant="indigo"
                            className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100 text-xs font-black uppercase tracking-widest gap-2"
                        >
                            <FileSpreadsheet className="w-4 h-4 pointer-events-none" />
                            Exportar CSV
                        </Button>
                    </div>
                }
            />

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden group bg-zinc-900 border-none">
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Faturamento Período</p>
                            <h3 className="text-3xl font-black text-white leading-none mt-1">
                                R$ {report?.stats.totalRevenue.toFixed(2) || "0.00"}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ticket Médio</p>
                            <h3 className="text-3xl font-black text-zinc-900 leading-none mt-1">
                                R$ {report?.stats.averageTicket.toFixed(2) || "0.00"}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Serviço + Vendido</p>
                            <h3 className="text-xl font-black text-zinc-900 leading-tight mt-1 uppercase tracking-tighter">
                                {report?.stats.bestService}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Top Profissional</p>
                            <h3 className="text-xl font-black text-zinc-900 leading-tight mt-1 uppercase tracking-tighter">
                                {report?.stats.topStaff}
                            </h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Detailed Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3 italic font-syne">
                            <TrendingUp className="w-5 h-5 text-indigo-600" /> Fluxo de Atendimentos
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {report?.stats.appointmentCount} registros
                        </span>
                    </div>

                    <Card padding="p-0 overflow-hidden shadow-2xl shadow-zinc-100 border-zinc-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-50/50">
                                    <tr className="border-b border-zinc-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Data</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Cliente</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Serviço / Profissional</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {report?.appointments.map((app) => (
                                        <tr key={app.id} className="hover:bg-zinc-50/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-black text-zinc-900 italic">
                                                    {DateTime.fromISO(app.startTime).toFormat('dd/MM/yyyy')}
                                                </div>
                                                <div className="text-[10px] font-bold text-zinc-400 mt-0.5">
                                                    {DateTime.fromISO(app.startTime).toFormat('HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-zinc-900 uppercase tracking-tight">{app.customer.name}</div>
                                                <div className="text-[10px] font-bold text-zinc-400">{app.customer.phone}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-zinc-600 ">{app.service.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{app.staff.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-lg font-black text-zinc-900 tracking-tighter italic">R$ {parseFloat(app.service.price).toFixed(2)}</div>
                                                <Badge variant={app.status === 'DONE' ? 'success' : 'indigo'} className="text-[9px] px-1.5 py-0 mt-1">{app.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {report?.appointments.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <p className="text-zinc-400 font-bold italic">Nenhum faturamento registrado neste período.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3 px-2 italic font-syne">
                        <PieChart className="w-5 h-5 text-indigo-600" /> Por Categoria
                    </h2>

                    <Card padding="p-8">
                        <div className="space-y-8">
                            {report?.categoryData.map((cat, i) => {
                                const percentage = (cat.value / report.stats.totalRevenue) * 100;
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">{cat.name}</span>
                                            <span className="text-xs font-bold text-zinc-400 italic">R$ {cat.value.toFixed(2)}</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="h-full bg-indigo-600 rounded-full"
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-right">
                                            {percentage.toFixed(1)}% do total
                                        </div>
                                    </div>
                                );
                            })}

                            {report?.categoryData.length === 0 && (
                                <p className="text-zinc-400 text-sm italic text-center py-10">Sem dados de categorias.</p>
                            )}
                        </div>
                    </Card>

                    <Card padding="p-8" className="bg-indigo-50 border-indigo-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Dica Premium</h4>
                            <p className="text-[10px] text-indigo-600 font-medium mt-1 leading-relaxed">
                                O serviço <span className="font-bold underline">{report?.stats.bestService}</span> é o seu carro-chefe.
                                Considere criar um pacote promocional com ele para aumentar o ticket médio.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
