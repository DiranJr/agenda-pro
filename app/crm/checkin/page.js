"use client";
import { useState, useEffect } from "react";
import {
    User,
    Scissors,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Plus,
    Search,
    UserPlus,
    X,
    ChevronRight,
    MapPin
} from "lucide-react";
import { PageHeader, Input, Select } from "@/app/components/ui/forms";
import { Button, Card, Badge } from "@/app/components/ui/core";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";

export default function CheckinPage() {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Data lists
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [locations, setLocations] = useState([]);

    // Selection State
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [query, setQuery] = useState("");

    // Date/Time
    const [date, setDate] = useState(DateTime.now().toISODate());
    const [time, setTime] = useState(DateTime.now().toFormat("HH:mm"));
    const [isNow, setIsNow] = useState(true);

    // New Customer Mode
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

    useEffect(() => {
        // Fetch base data
        Promise.all([
            fetch('/api/crm/services').then(res => res.json()),
            fetch('/api/crm/staff').then(res => res.json()),
            fetch('/api/crm/locations').then(res => res.json()).catch(() => [])
        ]).then(([servicesData, staffData, locData]) => {
            setServices(servicesData || []);
            setStaff(staffData || []);
            setLocations(locData || []);
            if (locData?.length > 0) setSelectedLocation(locData[0]);
        });
    }, []);

    const handleSearch = async (q) => {
        setQuery(q);
        if (q.length < 2) {
            setCustomers([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`/api/crm/customers?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setCustomers(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedService || !selectedStaff || (!selectedCustomer && !isNewCustomer)) {
            toast.error("Preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            let customerId = selectedCustomer?.id;

            // Handle New Customer Creation
            if (isNewCustomer) {
                const cRes = await fetch('/api/crm/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCustomer)
                });
                if (!cRes.ok) throw new Error("Erro ao criar cliente");
                const cData = await cRes.json();
                customerId = cData.id;
            }

            // Create Appointment
            const startTime = DateTime.fromISO(`${date}T${time}`).toUTC().toISO();
            const res = await fetch('/api/crm/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    serviceId: selectedService.id,
                    staffId: selectedStaff.id,
                    locationId: selectedLocation?.id || locations[0]?.id,
                    startTime,
                    status: 'CONFIRMED' // Check-in assumed confirmed or done
                })
            });

            if (res.ok) {
                toast.success("Atendimento registrado com sucesso!");
                resetForm();
            } else {
                toast.error("Erro ao registrar agendamento.");
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedCustomer(null);
        setSelectedService(null);
        setSelectedStaff(null);
        setIsNewCustomer(false);
        setNewCustomer({ name: "", phone: "" });
        setQuery("");
        setCustomers([]);
        setIsNow(true);
        setTime(DateTime.now().toFormat("HH:mm"));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <PageHeader
                title="Balcão (Check-in)"
                subtitle="Agende atendimentos presenciais ou rápidos com 1 clique."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Form */}
                <div className="space-y-8">
                    {/* Customer Selection */}
                    <Card padding="p-8" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-600" />
                                Cliente
                            </h3>
                            <button
                                onClick={() => { setIsNewCustomer(!isNewCustomer); setSelectedCustomer(null); }}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
                            >
                                {isNewCustomer ? "Buscar Existente" : "Novo Cliente"}
                            </button>
                        </div>

                        {isNewCustomer ? (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <Input
                                    label="Nome"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    placeholder="Nome do cliente"
                                />
                                <Input
                                    label="Fone"
                                    value={newCustomer.phone}
                                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedCustomer ? (
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between group animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                                                {selectedCustomer.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-zinc-900 uppercase tracking-tight">{selectedCustomer.name}</div>
                                                <div className="text-[10px] font-bold text-zinc-400">{selectedCustomer.phone}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedCustomer(null)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={e => handleSearch(e.target.value)}
                                            placeholder="Buscar por nome ou fone..."
                                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition-all"
                                        />
                                        {customers.length > 0 && !selectedCustomer && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-2xl z-20 py-2">
                                                {customers.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setSelectedCustomer(c)}
                                                        className="w-full px-6 py-3 text-left hover:bg-zinc-50 flex items-center justify-between group"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-black text-zinc-900 group-hover:text-indigo-600">{c.name}</div>
                                                            <div className="text-[10px] text-zinc-400">{c.phone}</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-indigo-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Service & Staff */}
                    <Card padding="p-8" className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-indigo-600" />
                                Serviço
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {services.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedService(s)}
                                        className={cn(
                                            "p-4 text-left rounded-2xl border transition-all flex items-center justify-between",
                                            selectedService?.id === s.id ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-white border-zinc-100 text-zinc-600 hover:border-indigo-200"
                                        )}
                                    >
                                        <div className="font-bold text-sm tracking-tight">{s.name}</div>
                                        <div className={cn("text-[10px] font-black uppercase tracking-widest", selectedService?.id === s.id ? "text-indigo-200" : "text-zinc-300")}>
                                            {s.duration} min · R$ {s.price}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-indigo-600" />
                                Profissional
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {staff.map(st => (
                                    <button
                                        key={st.id}
                                        onClick={() => setSelectedStaff(st)}
                                        className={cn(
                                            "p-4 text-center rounded-2xl border transition-all flex flex-col items-center gap-2",
                                            selectedStaff?.id === st.id ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-white border-zinc-100 text-zinc-600 hover:border-indigo-200"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black", selectedStaff?.id === st.id ? "bg-white/20" : "bg-zinc-50 text-zinc-300")}>
                                            {st.name[0]}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest">{st.name.split(' ')[0]}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Options & Summary */}
                <div className="space-y-8">
                    <Card padding="p-8" className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600" />
                                Horário do Atendimento
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setIsNow(true);
                                        setTime(DateTime.now().toFormat("HH:mm"));
                                    }}
                                    className={cn(
                                        "py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all",
                                        isNow ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                    )}
                                >
                                    Atendimento Agora
                                </button>
                                <button
                                    onClick={() => setIsNow(false)}
                                    className={cn(
                                        "py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all",
                                        !isNow ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                    )}
                                >
                                    Outro Horário
                                </button>
                            </div>

                            {!isNow && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold outline-none focus:bg-white"
                                    />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                        className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold outline-none focus:bg-white"
                                    />
                                </div>
                            )}
                        </div>

                        {locations.length > 1 && (
                            <div className="space-y-6 pt-4 border-t border-zinc-50">
                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    Unidade
                                </h3>
                                <Select
                                    value={selectedLocation?.id}
                                    onChange={id => setSelectedLocation(locations.find(l => l.id === id))}
                                    options={locations.map(l => ({ value: l.id, label: l.name }))}
                                />
                            </div>
                        )}
                    </Card>

                    <Card padding="p-8" className="bg-indigo-600 text-white space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16" />

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resumo da Comanda</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold opacity-60">Cliente</span>
                                    <span className="text-sm font-black uppercase tracking-tight">
                                        {isNewCustomer ? newCustomer.name || "---" : selectedCustomer?.name || "---"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold opacity-60">Serviço</span>
                                    <span className="text-sm font-black uppercase tracking-tight">{selectedService?.name || "---"}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold opacity-60">Profissional</span>
                                    <span className="text-sm font-black uppercase tracking-tight">{selectedStaff?.name || "---"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total a Pagar</p>
                                <p className="text-3xl font-black font-syne italic">R$ {selectedService?.price || "0,00"}</p>
                            </div>
                            <Button
                                onClick={handleConfirm}
                                loading={loading}
                                className="bg-white text-indigo-600 hover:bg-zinc-100 rounded-2xl h-16 px-10 font-black shadow-2xl"
                            >
                                <CheckCircle2 className="w-5 h-5 mr-3" />
                                CONFIRMAR
                            </Button>
                        </div>
                    </Card>

                    <button
                        onClick={resetForm}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        Limpar Formulário
                    </button>
                </div>
            </div>
        </div>
    );
}
