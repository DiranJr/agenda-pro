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
    const theme = tenant.theme || {};
    const variant = theme.layoutVariant || 'modern';

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

    // Estilos baseados no Template
    const getBgClass = () => {
        if (variant === 'dark') return 'bg-zinc-950 text-white';
        if (variant === 'minimal') return 'bg-white text-zinc-900';
        if (variant === 'glass') return 'bg-indigo-50/50 text-zinc-900';
        if (variant === 'elegant') return 'bg-stone-50 text-zinc-900';
        return 'bg-zinc-50/50 text-zinc-900';
    };

    const getCardClass = () => {
        if (variant === 'dark') return 'bg-zinc-900 border-zinc-800 text-white';
        if (variant === 'glass') return 'bg-white/40 backdrop-blur-xl border-white/40 shadow-xl shadow-indigo-100/20';
        if (variant === 'minimal') return 'bg-white border-zinc-100 shadow-none';
        if (variant === 'elegant') return 'bg-white border-stone-200 shadow-sm';
        return 'bg-white border-zinc-100 shadow-sm';
    };

    return (
        <div className={`max-w-md mx-auto min-h-screen flex flex-col pt-0 pb-10 transition-colors duration-500 ${getBgClass()}`}>

            {/* Header / Hero */}
            <header className={`relative p-8 pb-12 pt-20 text-center overflow-hidden transition-all duration-700 ${variant === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
                {website.heroImageUrl && (
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img src={website.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-b ${variant === 'dark' ? 'from-zinc-900/40 to-zinc-900' : 'from-white/40 to-white'}`}></div>
                    </div>
                )}

                <div className="relative z-10">
                    <div
                        style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--border-radius)' }}
                        className="w-24 h-24 mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/20"
                    >
                        {website.logoUrl ? <img src={website.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <div className="font-black text-3xl text-white">{tenant.name[0]}</div>}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 leading-tight">{website.heroTitle || tenant.name}</h1>
                    <p className={`text-sm leading-relaxed max-w-[280px] mx-auto opacity-70`}>
                        {website.heroSubtitle || "Especialistas em beleza e estética."}
                    </p>
                </div>
            </header>

            <div className="p-6 space-y-10">
                {step === 1 && (
                    <div className="space-y-10">
                        {/* Gallery Section */}
                        {website.gallery && website.gallery.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Nosso Trabalho</h2>
                                <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                                    {website.gallery.map((url, i) => (
                                        <div key={i} className="min-w-[260px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/20 shadow-xl group">
                                            <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Trabalho realizado" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Procedimentos & Serviços</h2>
                        </div>
                        <div className="grid gap-4">
                            {services.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setBooking({ ...booking, service: s }); setStep(2); }}
                                    className={`p-4 rounded-[var(--border-radius)] border transition-all text-left flex gap-4 items-center group active:scale-[0.98] ${getCardClass()}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-50 shadow-inner">
                                        {s.imageUrl ? (
                                            <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75A1.5 1.5 0 0 0 22.5 5.25H2.25A1.5 1.5 0 0 0 .75 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--primary-color)] transition-colors">{s.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{s.duration} min</span>
                                            {website.showPrices !== false && <span className="font-black text-xs text-[var(--primary-color)]">R$ {parseFloat(s.price).toFixed(2)}</span>}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[var(--primary-color)]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="text-zinc-400 p-2 hover:bg-zinc-100 rounded-full transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Com quem?</h2>
                        </div>
                        <div className="grid gap-4">
                            {staff.filter(st =>
                                !booking.service ||
                                st.services.some(s => s.serviceId === booking.service.id)
                            ).map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => { setBooking({ ...booking, staff: st }); setStep(3); }}
                                    className={`p-5 rounded-[var(--border-radius)] border text-left flex items-center gap-4 hover:border-[var(--primary-color)] transition-all active:scale-[0.98] ${getCardClass()}`}
                                >
                                    <div className="w-14 h-14 bg-zinc-100 rounded-full flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-zinc-300 font-black">
                                        {st.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{st.name}</h3>
                                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{st.location?.name || 'Unidade Principal'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(2)} className="text-zinc-400 p-2 hover:bg-zinc-100 rounded-full transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Escolha o horário</h2>
                        </div>

                        <input
                            type="date"
                            value={booking.date}
                            onChange={e => setBooking({ ...booking, date: e.target.value })}
                            className={`w-full p-4 rounded-[var(--border-radius)] border font-bold text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-20 transition-all ${getCardClass()}`}
                        />

                        {loadingSlots ? (
                            <div className="space-y-3 py-10">
                                <div className="w-10 h-10 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-40">Buscando disponibilidade...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => { setBooking({ ...booking, time: slot }); setStep(4); }}
                                        className={`p-4 border rounded-2xl text-sm font-bold hover:bg-[var(--primary-color)] hover:text-white hover:border-transparent transition-all shadow-sm active:scale-90 ${getCardClass()}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                                {slots.length === 0 && (
                                    <div className="col-span-3 text-center py-20 opacity-30">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto mb-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008h-.008v-.008Z" />
                                        </svg>
                                        <p className="text-xs font-bold uppercase tracking-widest">Nenhum horário livre nesta data.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(3)} className="text-zinc-400 p-2 hover:bg-zinc-100 rounded-full transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Finalizar Agendamento</h2>
                        </div>

                        <div className={`p-6 border rounded-[var(--border-radius)] ${getCardClass()}`}>
                            <div className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest">Resumo</div>
                            <div className="space-y-3">
                                <div className="flex justify-between font-black text-lg">
                                    <span>{booking.service.name}</span>
                                    <span style={{ color: 'var(--primary-color)' }}>R$ {parseFloat(booking.service.price).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    {booking.staff.name}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                    {DateTime.fromISO(booking.date).setLocale('pt-BR').toLocaleString(DateTime.DATE_MED)} às {booking.time}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest ml-1">Seu Nome</label>
                                <input name="name" required className={`w-full p-4 mt-1 border rounded-[var(--border-radius)] outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-20 transition-all ${getCardClass()}`} placeholder="Como podemos te chamar?" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest ml-1">WhatsApp</label>
                                <input name="phone" required className={`w-full p-4 mt-1 border rounded-[var(--border-radius)] outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-20 transition-all ${getCardClass()}`} placeholder="(00) 00000-0000" />
                            </div>
                            <button
                                type="submit"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                                className="w-full py-5 text-white font-black rounded-[var(--border-radius)] shadow-xl mt-4 active:scale-[0.98] transition-all hover:brightness-110"
                            >
                                CONFIRMAR AGENDAMENTO
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <footer className="mt-auto p-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
                    Tecnologia <span className={variant === 'dark' ? 'text-white' : 'text-zinc-900'}>Agenda Pro</span>
                </p>
            </footer>

            {/* Floating WhatsApp Button */}
            {website.contactWhatsapp && (
                <a
                    href={`https://wa.me/${website.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de tirar uma dúvida sobre os serviços do ${tenant.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all z-50"
                >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
