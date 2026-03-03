"use client";
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export default function PublicHomeUI({ tenant, services, staff }) {
    const [step, setStep] = useState(1); // 1: Home/Services, 2: Staff, 3: Slots, 4: Details
    const [booking, setBooking] = useState({
        service: null,
        staff: null,
        date: DateTime.now().toISODate(),
        time: null,
    });
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const website = tenant.websiteConfig || {};

    // Buscar slots quando profissional e data são selecionados
    useEffect(() => {
        if (step === 3 && booking.staff && booking.service && booking.date) {
            setLoadingSlots(true);
            fetch(`/api/public/availability?slug=${tenant.slug}&staffId=${booking.staff.id}&serviceId=${booking.service.id}&date=${booking.date}`)
                .then(res => res.json())
                .then(data => {
                    setSlots(data.slots || []);
                    setLoadingSlots(false);
                });
        }
    }, [step, booking.staff, booking.service, booking.date, tenant.slug]);

    const handleBooking = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customer = {
            name: formData.get('name'),
            phone: formData.get('phone'),
        };

        const res = await fetch('/api/public/book', {
            method: 'POST',
            body: JSON.stringify({
                slug: tenant.slug,
                serviceId: booking.service.id,
                staffId: booking.staff.id,
                date: booking.date,
                time: booking.time,
                customer
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            alert("Agendamento realizado com sucesso!");
            setStep(1);
        } else {
            const err = await res.json();
            alert("Erro ao agendar: " + err.error);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col pt-0 pb-10 bg-zinc-50/30">
            {/* Header / Hero */}
            <header className="p-8 pb-12 pt-16 text-center bg-white border-b border-zinc-100">
                <div className="w-20 h-20 bg-zinc-100 rounded-[var(--border-radius)] mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    {website.logoUrl ? <img src={website.logoUrl} alt="Logo" /> : <div className="font-black text-2xl">{tenant.name[0]}</div>}
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2">{website.heroTitle || tenant.name}</h1>
                <p className="text-zinc-500 text-sm leading-relaxed">{website.heroSubtitle || "Especialistas em beleza e estética."}</p>
            </header>

            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Escolha um serviço</h2>
                        <div className="grid gap-4">
                            {services.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setBooking({ ...booking, service: s }); setStep(2); }}
                                    className="bg-white p-5 rounded-[var(--border-radius)] border border-zinc-100 text-left hover:border-[var(--primary-color)] transition-colors flex justify-between items-center group"
                                >
                                    <div>
                                        <h3 className="font-bold group-hover:text-[var(--primary-color)] transition-colors">{s.name}</h3>
                                        <p className="text-xs text-zinc-400 font-medium">{s.duration} min</p>
                                    </div>
                                    {website.showPrices !== false && <div className="font-black text-zinc-900">R$ {parseFloat(s.price).toFixed(2)}</div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="text-zinc-400">←</button>
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Com quem?</h2>
                        </div>
                        <div className="grid gap-4">
                            {staff.map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => { setBooking({ ...booking, staff: st }); setStep(3); }}
                                    className="bg-white p-5 rounded-[var(--border-radius)] border border-zinc-100 text-left flex items-center gap-4 hover:border-[var(--primary-color)] transition-all"
                                >
                                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold">{st.name}</h3>
                                        <p className="text-xs text-zinc-400 font-medium">{st.location?.name || 'Unidade Principal'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(2)} className="text-zinc-400">←</button>
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Quando?</h2>
                        </div>

                        <input
                            type="date"
                            value={booking.date}
                            onChange={e => setBooking({ ...booking, date: e.target.value })}
                            className="w-full p-4 rounded-[var(--border-radius)] border border-zinc-100 bg-white font-bold text-sm"
                        />

                        {loadingSlots ? (
                            <p className="text-center text-zinc-400 py-10">Buscando horários...</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => { setBooking({ ...booking, time: slot }); setStep(4); }}
                                        className="p-3 bg-white border border-zinc-100 rounded-xl text-sm font-bold hover:bg-[var(--primary-color)] hover:text-white hover:border-transparent transition-all"
                                    >
                                        {slot}
                                    </button>
                                ))}
                                {slots.length === 0 && <p className="col-span-3 text-center text-zinc-400 py-10 text-xs">Nenhum horário livre.</p>}
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(3)} className="text-zinc-400">←</button>
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Confirme seus dados</h2>
                        </div>

                        <div className="p-6 bg-white border border-zinc-100 rounded-[var(--border-radius)] mb-6">
                            <div className="text-xs font-bold text-zinc-400 uppercase mb-4 tracking-tighter italic">Resumo do Agendamento</div>
                            <div className="space-y-2">
                                <div className="flex justify-between font-bold"><span>{booking.service.name}</span> <span className="text-[var(--primary-color)]">R$ {parseFloat(booking.service.price).toFixed(2)}</span></div>
                                <div className="text-sm text-zinc-500">{booking.staff.name}</div>
                                <div className="text-sm text-zinc-500">{DateTime.fromISO(booking.date).setLocale('pt-BR').toLocaleString(DateTime.DATE_MED)} às {booking.time}</div>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Seu Nome</label>
                                <input name="name" required className="w-full p-4 mt-1 border border-zinc-100 rounded-[var(--border-radius)] bg-white" placeholder="Como podemos te chamar?" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">WhatsApp</label>
                                <input name="phone" required className="w-full p-4 mt-1 border border-zinc-100 rounded-[var(--border-radius)] bg-white" placeholder="(00) 00000-0000" />
                            </div>
                            <button
                                type="submit"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                                className="w-full py-5 text-white font-black rounded-[var(--border-radius)] shadow-lg shadow-[var(--primary-color)]/20 active:scale-[0.98] transition-all"
                            >
                                Confirmar Agendamento
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <footer className="mt-auto p-10 text-center">
                <p className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">
                    Feito com <span className="text-zinc-900">Agenda Pro</span>
                </p>
            </footer>
        </div>
    );
}
