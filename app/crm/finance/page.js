"use client";
import { useState, useEffect } from "react";
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
    Plus
} from "lucide-react";
import { PageHeader } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        revenue: 12450.00,
        expenses: 3200.00,
        pending: 1200.00,
        growth: 12.5,
        transactions: [],
        commissions: []
    });

    useEffect(() => {
        // Mocking finance data for showcase
        setTimeout(() => {
            setData({
                revenue: 15780.40,
                expenses: 4120.00,
                pending: 850.00,
                growth: 18.2,
                transactions: [
                    { id: 1, type: 'INCOME', category: 'Procedimento', description: 'Cílios Volume Russo - Maria', value: 180.00, date: 'Hoje, 09:30', status: 'PAID' },
                    { id: 2, type: 'OUTCOME', category: 'Suprimentos', description: 'Compra de Adesivos e Fios', value: 450.00, date: 'Hoje, 08:15', status: 'PAID' },
                    { id: 3, type: 'INCOME', category: 'Procedimento', description: 'Design de Sobrancelha - Ana', value: 85.00, date: 'Ontem', status: 'PAID' },
                    { id: 4, type: 'INCOME', category: 'Venda de Produto', description: 'Kit Home Care Pós Procedimento', value: 120.00, date: 'Ontem', status: 'PAID' },
                    { id: 5, type: 'OUTCOME', category: 'Aluguel', description: 'Parcela Mensal Sala 04', value: 1200.00, date: '01/03', status: 'PAID' },
                ],
                commissions: [
                    { name: 'Amanda Lima', services: 42, total: 4200.00, commission: 2100.00, rate: '50%' },
                    { name: 'Bruna Silva', services: 28, total: 3100.00, commission: 1240.00, rate: '40%' },
                    { name: 'Carol Costa', services: 15, total: 1800.00, commission: 630.00, rate: '35%' },
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    const profit = data.revenue - data.expenses;

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Calculando balanço financeiro...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <PageHeader
                title="Centro Financeiro"
                subtitle="Monitore sua saúde financeira, lucros e comissões da equipe."
                actions={
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => toast.success("Relatórios financeiros em processamento...")}
                            variant="outline"
                            className="gap-2 active:scale-95 transition-all"
                        >
                            <Download className="w-4 h-4 pointer-events-none" />
                            Relatórios
                        </Button>
                        <Button
                            onClick={() => toast.success("Lançamento de despesa em breve...")}
                            className="gap-2 bg-green-600 hover:bg-green-700 shadow-green-100 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4 pointer-events-none" />
                            Lançar Despesa
                        </Button>
                    </div>
                }
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Faturamento Bruto</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-3xl font-black text-zinc-900 leading-none">R$ {data.revenue.toFixed(2)}</h3>
                            <div className="flex items-center text-green-500 font-black text-xs mb-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {data.growth}%
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <TrendingUp className="w-40 h-40 text-black" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Despesas Totais</p>
                        <h3 className="text-3xl font-black text-red-500 leading-none">R$ {data.expenses.toFixed(2)}</h3>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <TrendingDown className="w-40 h-40 text-black" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden group border-indigo-100 bg-indigo-50/20">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Lucro Líquido</p>
                        <h3 className="text-3xl font-black text-indigo-900 leading-none">R$ {profit.toFixed(2)}</h3>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                        <PieChart className="w-40 h-40 text-indigo-900" />
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Contas a Receber</p>
                        <h3 className="text-3xl font-black text-amber-500 leading-none">R$ {data.pending.toFixed(2)}</h3>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Wallet className="w-40 h-40 text-black" />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <Card padding="p-0" className="lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-8 bg-zinc-900 rounded-full" />
                            <h2 className="text-xl font-black tracking-tight">Fluxo de Caixa</h2>
                        </div>
                        <Button
                            onClick={() => toast.success("Extrato completo disponível em breve...")}
                            variant="ghost"
                            size="sm"
                            className="text-xs font-black uppercase tracking-widest text-indigo-600 active:scale-95 transition-all"
                        >
                            Ver Extrato Completo
                        </Button>
                    </div>

                    <div className="flex-1 divide-y divide-zinc-50">
                        {data.transactions.map(t => (
                            <div key={t.id} className="p-8 flex items-center justify-between hover:bg-zinc-50/50 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
                                        t.type === 'INCOME' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {t.type === 'INCOME' ? <ArrowUpRight className="w-6 h-6 pointer-events-none" /> : <ArrowDownRight className="w-6 h-6 pointer-events-none" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-zinc-900 uppercase tracking-tight mb-1">{t.description}</p>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="default" className="bg-zinc-100 text-zinc-500 border-none px-2 py-0">{t.category}</Badge>
                                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{t.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "text-xl font-black tracking-tighter leading-none mb-1",
                                        t.type === 'INCOME' ? "text-zinc-900" : "text-red-500"
                                    )}>
                                        {t.type === 'INCOME' ? '+' : '-'} R$ {t.value.toFixed(2)}
                                    </p>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">Confirmado</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Team Commissions */}
                <Card padding="p-0" className="overflow-hidden flex flex-col border-indigo-100 shadow-xl shadow-indigo-100/10">
                    <div className="p-10 border-b border-zinc-100 flex items-center gap-4 bg-indigo-50/30">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight">Comissões</h2>
                    </div>

                    <div className="p-8 space-y-6 flex-1">
                        {data.commissions.map((comm, i) => (
                            <div key={i} className="group p-6 bg-white border border-zinc-100 rounded-3xl hover:border-indigo-600 transition-all shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-sm font-black text-zinc-400 border border-zinc-100">
                                            {comm.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 uppercase tracking-tight leading-none mb-1">{comm.name}</h4>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{comm.services} atendimentos</p>
                                        </div>
                                    </div>
                                    <Badge variant="indigo" className="py-0 px-2">{comm.rate}</Badge>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-zinc-300 tracking-widest mb-1">A Repassar</p>
                                        <p className="text-xl font-black text-zinc-900 tracking-tighter">R$ {comm.commission.toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => toast.success(`Pagamento de ${comm.name} em processamento...`)}
                                        className="p-3 bg-zinc-50 text-zinc-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                                    >
                                        <ArrowRight className="w-5 h-5 pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="pt-6">
                            <Button
                                onClick={() => toast.success("Configuração de comissões em breve...")}
                                variant="secondary"
                                className="w-full py-4 text-xs font-black uppercase tracking-widest border-2 border-dashed border-zinc-200 bg-transparent hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all"
                            >
                                Configurar Regras de Divisão
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
