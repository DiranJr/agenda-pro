"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { Badge } from "@/app/components/ui/forms";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    Zap,
    Users,
    Scissors,
    Image as ImageIcon,
    ArrowUpRight,
    Star,
    AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function PlanoPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlano = async () => {
            try {
                const res = await fetch("/api/crm/plano");
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                } else {
                    toast.error("Erro ao carregar dados do plano.");
                }
            } catch (err) {
                toast.error("Erro de conexão.");
            } finally {
                setLoading(false);
            }
        };

        loadPlano();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-400 font-black uppercase tracking-widest text-xs animate-pulse">Consultando recursos...</p>
            </div>
        );
    }

    if (!data) return null;

    const { planId, plan, usage } = data;

    const getPercentage = (used, limit) => {
        if (limit === 999) return 0; // Ilimitado visualmente
        return Math.min(100, Math.round((used / limit) * 100));
    };

    const isLimitReached = (used, limit) => {
        return used >= limit;
    };

    const handleUpgrade = () => {
        toast.error("Integração com gateway de pagamento em desenvolvimento!");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans">
            <PageHeader
                title="Meu Plano"
                subtitle="Acompanhe o uso dos seus recursos e faça upgrades para crescer seu negócio."
            />

            {/* Current Plan Card */}
            <Card padding="p-0 overflow-hidden" className="border-indigo-100 shadow-xl shadow-indigo-50 relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-[8rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />

                <div className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <Badge variant="indigo" className="mb-2">PLANO ATUAL</Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight font-syne uppercase">
                            {plan.name}
                        </h2>
                        <p className="text-zinc-500 font-medium max-w-md">
                            Você está no controle. Desbloqueie todo o poder da AgendaPro mudando para um plano superior quando estiver pronto.
                        </p>
                    </div>

                    <div className="shrink-0 space-y-4">
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-black text-indigo-600 font-syne">{plan.price}</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assinatura Ativa</p>
                        </div>
                        {planId !== 'enterprise' && (
                            <Button onClick={handleUpgrade} size="lg" className="w-full gap-2 rounded-2xl shadow-lg shadow-indigo-100 uppercase tracking-widest font-black text-xs">
                                <ArrowUpRight className="w-4 h-4" />
                                Fazer Upgrade
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Usage Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profissionais */}
                <Card padding="p-8" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Users className="w-6 h-6" />
                        </div>
                        <Badge variant={isLimitReached(usage.staff, plan.limits.staff) ? "danger" : "default"}>
                            {usage.staff} / {plan.limits.staff === 999 ? '∞' : plan.limits.staff} Usados
                        </Badge>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900">Profissionais</h3>
                        <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                            {plan.limits.staff === 999 ? 'Limite Ilimitado' : `Máximo de ${plan.limits.staff} ativos`}
                        </p>
                    </div>
                    {plan.limits.staff !== 999 && (
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        isLimitReached(usage.staff, plan.limits.staff) ? "bg-red-500" : "bg-indigo-600"
                                    )}
                                    style={{ width: `${getPercentage(usage.staff, plan.limits.staff)}%` }}
                                />
                            </div>
                            {isLimitReached(usage.staff, plan.limits.staff) && (
                                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Limite atingido. Faça upgrade.
                                </p>
                            )}
                        </div>
                    )}
                </Card>

                {/* Serviços */}
                <Card padding="p-8" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Scissors className="w-6 h-6" />
                        </div>
                        <Badge variant={isLimitReached(usage.services, plan.limits.services) ? "danger" : "default"}>
                            {usage.services} / {plan.limits.services === 999 ? '∞' : plan.limits.services} Usados
                        </Badge>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900">Serviços</h3>
                        <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                            {plan.limits.services === 999 ? 'Limite Ilimitado' : `Máximo de ${plan.limits.services} ativos`}
                        </p>
                    </div>
                    {plan.limits.services !== 999 && (
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        isLimitReached(usage.services, plan.limits.services) ? "bg-red-500" : "bg-indigo-600"
                                    )}
                                    style={{ width: `${getPercentage(usage.services, plan.limits.services)}%` }}
                                />
                            </div>
                            {isLimitReached(usage.services, plan.limits.services) && (
                                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Limite atingido. Faça upgrade.
                                </p>
                            )}
                        </div>
                    )}
                </Card>

                {/* Galeria */}
                <Card padding="p-8" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <Badge variant="default">
                            {usage.gallery} / {plan.limits.gallery} Usados
                        </Badge>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900">Imagens Galeria</h3>
                        <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">No seu site de agendamento</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                style={{ width: `${getPercentage(usage.gallery, plan.limits.gallery)}%` }}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Comparison Details */}
            <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3 font-syne italic">
                        <Zap className="w-5 h-5 text-indigo-600" /> Benefícios do seu plano
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(PLANS).map(([key, planData]) => {
                        const isCurrent = key === planId;
                        return (
                            <Card key={key} padding="p-8" className={cn(
                                "flex flex-col space-y-6 transition-all duration-300",
                                isCurrent ? "border-indigo-600 ring-4 ring-indigo-50" : "opacity-60 grayscale hover:grayscale-0"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase text-zinc-900">{planData.name}</h3>
                                        <div className="text-sm font-bold text-zinc-400 font-syne uppercase tracking-widest">{planData.price}</div>
                                    </div>
                                    {isCurrent && (
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <hr className="border-zinc-100" />
                                <ul className="space-y-3 flex-1">
                                    {planData.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                            {f === 'basic_crm' ? 'CRM Básico' :
                                                f === 'advanced_crm' ? 'CRM Avançado e Segmentação' :
                                                    f === 'simple_website' ? 'Mini Site de Agendamento' :
                                                        f === 'custom_website' ? 'Todos os Templates Premium' :
                                                            f === 'finance_reports' ? 'Relatórios Financeiros Avançados' :
                                                                f === 'customer_recovery' ? 'Automação de Recuperação' :
                                                                    f === 'appointments' ? 'Agendamentos Ilimitados' :
                                                                        f === 'multi_location' ? 'Múltiplas Unidades' :
                                                                            f === 'checkin_pro' ? 'Sistema de Check-in em Balcão (Balcão PRO)' : f}
                                        </li>
                                    ))}
                                </ul>

                                {!isCurrent && (
                                    <Button onClick={handleUpgrade} variant="outline" className="w-full mt-auto">
                                        Mudar para {planData.name}
                                    </Button>
                                )}
                            </Card>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}
