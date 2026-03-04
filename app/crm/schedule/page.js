"use client";
import { useState, useEffect, useCallback } from "react";
import {
    Calendar,
    Clock,
    Coffee,
    Plus,
    Trash2,
    Save,
    Check,
    ChevronDown,
    Sun,
    Moon,
    AlertCircle,
    User
} from "lucide-react";
import { PageHeader, Badge } from "@/app/components/ui/forms";
import { Button, Card } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const DAYS = [
    { key: 'mon', label: 'Segunda', short: 'Seg' },
    { key: 'tue', label: 'Terça', short: 'Ter' },
    { key: 'wed', label: 'Quarta', short: 'Qua' },
    { key: 'thu', label: 'Quinta', short: 'Qui' },
    { key: 'fri', label: 'Sexta', short: 'Sex' },
    { key: 'sat', label: 'Sábado', short: 'Sáb' },
    { key: 'sun', label: 'Domingo', short: 'Dom' },
];

const DEFAULT_DAY = { active: false, start: '09:00', end: '18:00', breaks: [] };

const DEFAULT_SCHEDULE = {
    mon: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    tue: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    wed: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    thu: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    fri: { active: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
    sat: { active: false, start: '09:00', end: '14:00', breaks: [] },
    sun: { active: false, start: '09:00', end: '12:00', breaks: [] },
};

export default function SchedulePage() {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const loadStaff = useCallback(async () => {
        const res = await fetch('/api/crm/staff');
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setStaffList(list);
        if (list.length > 0) {
            setSelectedStaff(list[0]);
            loadSchedule(list[0].id);
        } else {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Initial load
    useEffect(() => { loadStaff(); }, [loadStaff]);

    const loadSchedule = async (staffId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/crm/staff/${staffId}/schedule`);
            const data = await res.json();
            if (data.workSchedule) {
                setSchedule({ ...DEFAULT_SCHEDULE, ...data.workSchedule });
            } else {
                setSchedule(DEFAULT_SCHEDULE);
            }
        } catch {
            setSchedule(DEFAULT_SCHEDULE);
        } finally {
            setLoading(false);
            setHasChanges(false);
        }
    };

    const handleSelectStaff = (member) => {
        setSelectedStaff(member);
        loadSchedule(member.id);
    };

    const updateDay = (dayKey, field, value) => {
        setHasChanges(true);
        setSchedule(prev => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], [field]: value }
        }));
    };

    const toggleDay = (dayKey) => {
        setHasChanges(true);
        setSchedule(prev => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], active: !prev[dayKey].active }
        }));
    };

    const addBreak = (dayKey) => {
        setHasChanges(true);
        setSchedule(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                breaks: [...(prev[dayKey].breaks || []), { start: '12:00', end: '13:00' }]
            }
        }));
    };

    const updateBreak = (dayKey, breakIndex, field, value) => {
        setHasChanges(true);
        setSchedule(prev => {
            const breaks = [...(prev[dayKey].breaks || [])];
            breaks[breakIndex] = { ...breaks[breakIndex], [field]: value };
            return { ...prev, [dayKey]: { ...prev[dayKey], breaks } };
        });
    };

    const removeBreak = (dayKey, breakIndex) => {
        setHasChanges(true);
        setSchedule(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                breaks: prev[dayKey].breaks.filter((_, i) => i !== breakIndex)
            }
        }));
    };

    const handleSave = async () => {
        if (!selectedStaff) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/crm/staff/${selectedStaff.id}/schedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedule)
            });
            if (res.ok) {
                toast.success("Grade de trabalho salva com sucesso!");
                setHasChanges(false);
            } else {
                const err = await res.json();
                toast.error("Erro ao salvar: " + (err.error?.message || "Tente novamente."));
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    const applyToAll = (dayKey) => {
        const source = schedule[dayKey];
        setHasChanges(true);
        setSchedule(prev => {
            const updated = { ...prev };
            DAYS.forEach(d => {
                if (d.key !== dayKey) {
                    updated[d.key] = { ...source };
                }
            });
            return updated;
        });
        toast.success("Horário aplicado a todos os dias!");
    };

    const activeDays = DAYS.filter(d => schedule[d.key]?.active).length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <PageHeader
                title="Grade de Trabalho"
                subtitle="Configure os dias, horários e pausas de cada profissional."
                actions={
                    <div className="flex items-center gap-4">
                        {hasChanges && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Não salvo</span>
                            </div>
                        )}
                        <Button onClick={handleSave} disabled={!hasChanges || saving} loading={saving} className="gap-2 active:scale-95 transition-all">
                            <Save className="w-4 h-4 pointer-events-none" />
                            Salvar Grade
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Staff Selector */}
                <Card padding="p-0" className="h-fit overflow-hidden">
                    <div className="p-6 border-b border-zinc-50 bg-zinc-50/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Selecionar Profissional</p>
                    </div>
                    <div className="divide-y divide-zinc-50">
                        {staffList.map(member => (
                            <button
                                key={member.id}
                                onClick={() => handleSelectStaff(member)}
                                className={cn(
                                    "w-full p-5 flex items-center gap-4 text-left transition-all hover:bg-zinc-50",
                                    selectedStaff?.id === member.id && "bg-indigo-50 border-l-4 border-indigo-600"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0",
                                    selectedStaff?.id === member.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500"
                                )}>
                                    {member.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-zinc-900 text-sm truncate">{member.name}</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                                        {member.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                    </p>
                                </div>
                                {selectedStaff?.id === member.id && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                            </button>
                        ))}
                        {staffList.length === 0 && !loading && (
                            <div className="p-8 text-center">
                                <User className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Nenhum profissional cadastrado</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Schedule Editor */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Summary Bar */}
                    {selectedStaff && !loading && (
                        <Card className="flex items-center justify-between py-5 px-8">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                                    {selectedStaff.name[0]}
                                </div>
                                <div>
                                    <p className="font-black text-zinc-900">{selectedStaff.name}</p>
                                    <p className="text-xs font-bold text-zinc-400">{activeDays} dia{activeDays !== 1 ? 's' : ''} de trabalho por semana</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {DAYS.map(d => (
                                    <button
                                        key={d.key}
                                        onClick={() => toggleDay(d.key)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl text-[10px] font-black uppercase transition-all",
                                            schedule[d.key]?.active
                                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                                        )}
                                    >
                                        {d.short}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Carregando grade...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {DAYS.map(day => {
                                const dayData = schedule[day.key] || DEFAULT_DAY;
                                return (
                                    <Card
                                        key={day.key}
                                        padding="p-0"
                                        className={cn(
                                            "overflow-hidden transition-all duration-300",
                                            !dayData.active && "opacity-60"
                                        )}
                                    >
                                        {/* Day Header */}
                                        <div className={cn(
                                            "flex items-center justify-between p-6 transition-colors",
                                            dayData.active ? "bg-white" : "bg-zinc-50/50"
                                        )}>
                                            <div className="flex items-center gap-5">
                                                {/* Toggle */}
                                                <button
                                                    onClick={() => toggleDay(day.key)}
                                                    className={cn(
                                                        "w-14 h-7 rounded-full transition-all relative shrink-0",
                                                        dayData.active ? "bg-indigo-600" : "bg-zinc-200"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
                                                        dayData.active ? "left-8" : "left-1"
                                                    )} />
                                                </button>
                                                <div>
                                                    <p className="font-black text-zinc-900">{day.label}</p>
                                                    <p className={cn(
                                                        "text-[10px] font-bold uppercase tracking-widest",
                                                        dayData.active ? "text-indigo-600" : "text-zinc-400"
                                                    )}>
                                                        {dayData.active ? `${dayData.start} — ${dayData.end}` : 'Folga / Descanso'}
                                                    </p>
                                                </div>
                                            </div>

                                            {dayData.active && (
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="default" className="text-zinc-500 bg-zinc-100 border-0">
                                                        {dayData.breaks?.length || 0} pausa{dayData.breaks?.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                    <button
                                                        onClick={() => applyToAll(day.key)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
                                                    >
                                                        Aplicar a todos
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Day Body */}
                                        {dayData.active && (
                                            <div className="border-t border-zinc-50 p-6 space-y-6 bg-zinc-50/20">
                                                {/* Working Hours */}
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-3 text-zinc-500">
                                                        <Sun className="w-4 h-4 text-amber-400" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Entrada</span>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        value={dayData.start}
                                                        onChange={e => updateDay(day.key, 'start', e.target.value)}
                                                        className="p-3 bg-white border border-zinc-200 rounded-xl font-black text-sm focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all"
                                                    />
                                                    <div className="flex items-center gap-3 text-zinc-500 ml-4">
                                                        <Moon className="w-4 h-4 text-indigo-400" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Saída</span>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        value={dayData.end}
                                                        onChange={e => updateDay(day.key, 'end', e.target.value)}
                                                        className="p-3 bg-white border border-zinc-200 rounded-xl font-black text-sm focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all"
                                                    />
                                                </div>

                                                {/* Breaks */}
                                                {dayData.breaks?.length > 0 && (
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                                            <Coffee className="w-3 h-3" />
                                                            Pausas / Intervalos
                                                        </p>
                                                        {dayData.breaks.map((b, bi) => (
                                                            <div key={bi} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100">
                                                                <Coffee className="w-4 h-4 text-zinc-300 shrink-0" />
                                                                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">De</span>
                                                                <input
                                                                    type="time"
                                                                    value={b.start}
                                                                    onChange={e => updateBreak(day.key, bi, 'start', e.target.value)}
                                                                    className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-sm focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                                                                />
                                                                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Até</span>
                                                                <input
                                                                    type="time"
                                                                    value={b.end}
                                                                    onChange={e => updateBreak(day.key, bi, 'end', e.target.value)}
                                                                    className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-sm focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                                                                />
                                                                <button
                                                                    onClick={() => removeBreak(day.key, bi)}
                                                                    className="ml-auto p-2 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => addBreak(day.key)}
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Adicionar Pausa
                                                </button>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
