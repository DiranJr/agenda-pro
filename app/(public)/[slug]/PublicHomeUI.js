"use client";
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
const THEMES = {
    modern: {
        page: 'bg-zinc-950 text-white min-h-screen',
        header: 'bg-zinc-950 text-white pt-20 pb-16 px-6 text-center relative overflow-hidden',
        logoBox: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
        title: 'text-white',
        subtitle: 'text-zinc-400',
        card: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
        serviceName: 'text-white',
        price: 'text-indigo-400',
        meta: 'text-zinc-500',
        input: 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-indigo-500',
        slotBtn: 'bg-white/10 text-white hover:bg-indigo-600 border-white/20',
        cta: 'bg-indigo-600 text-white hover:bg-indigo-500',
        badge: 'bg-white/10 text-white/60 text-[10px]',
        backBtn: 'bg-white/10 text-white/60 hover:bg-white/20',
        summaryCard: 'bg-white/5 border-white/10',
        footer: 'text-zinc-700',
        label: 'text-zinc-400',
    },
    glass: {
        page: 'min-h-screen text-zinc-900',
        pageBg: 'fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100',
        header: 'bg-white/30 backdrop-blur-xl border-b border-white/40 pt-20 pb-16 px-6 text-center relative',
        logoBox: 'bg-white/60 backdrop-blur-md border border-white/80 text-indigo-700 shadow-xl',
        title: 'text-zinc-900',
        subtitle: 'text-zinc-600',
        card: 'bg-white/50 backdrop-blur-xl border border-white/60 text-zinc-900 hover:bg-white/70 shadow-lg shadow-purple-100/30 hover:shadow-xl',
        serviceName: 'text-zinc-900',
        price: 'text-indigo-600',
        meta: 'text-zinc-500',
        input: 'bg-white/60 backdrop-blur-md border-white/60 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white/80',
        slotBtn: 'bg-white/50 backdrop-blur-md text-zinc-800 hover:bg-indigo-600 hover:text-white border-white/60',
        cta: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200',
        badge: 'bg-white/40 backdrop-blur-md text-zinc-500 text-[10px] border border-white/60',
        backBtn: 'bg-white/40 backdrop-blur-md text-zinc-500 hover:bg-white/70',
        summaryCard: 'bg-white/40 backdrop-blur-xl border-white/60',
        footer: 'text-zinc-400',
        label: 'text-zinc-500',
    },
    minimal: {
        page: 'bg-white text-zinc-900 min-h-screen',
        header: 'bg-white border-b border-zinc-100 pt-20 pb-16 px-6 text-center',
        logoBox: 'bg-zinc-900 text-white border-zinc-900',
        title: 'text-zinc-900',
        subtitle: 'text-zinc-500',
        card: 'bg-white border border-zinc-200 text-zinc-900 hover:border-zinc-400 shadow-none',
        serviceName: 'text-zinc-900',
        price: 'text-zinc-900 font-black',
        meta: 'text-zinc-400',
        input: 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900',
        slotBtn: 'bg-zinc-50 text-zinc-800 hover:bg-zinc-900 hover:text-white border-zinc-200',
        cta: 'bg-zinc-900 text-white hover:bg-zinc-800',
        badge: 'bg-zinc-100 text-zinc-500 text-[10px]',
        backBtn: 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200',
        summaryCard: 'bg-zinc-50 border-zinc-200',
        footer: 'text-zinc-300',
        label: 'text-zinc-500',
    },
    elegant: {
        page: 'min-h-screen text-stone-900',
        pageBg: 'fixed inset-0 z-[-1] bg-[#F8F4EF]',
        header: 'bg-[#F8F4EF] pt-20 pb-16 px-6 text-center',
        logoBox: 'bg-stone-800 text-amber-100 border-stone-800',
        title: 'text-stone-900 font-serif',
        subtitle: 'text-stone-500 font-light italic',
        card: 'bg-white border border-stone-200 text-stone-900 hover:border-amber-400 hover:shadow-amber-50 shadow-sm',
        serviceName: 'text-stone-900',
        price: 'text-amber-700',
        meta: 'text-stone-400',
        input: 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-500',
        slotBtn: 'bg-amber-50 text-stone-800 hover:bg-amber-500 hover:text-white border-stone-200',
        cta: 'bg-stone-800 text-white hover:bg-stone-900',
        badge: 'bg-stone-100 text-stone-400 text-[10px]',
        backBtn: 'bg-stone-100 text-stone-500 hover:bg-stone-200',
        summaryCard: 'bg-white border-stone-200',
        footer: 'text-stone-300',
        label: 'text-stone-500',
    },
    dark: {
        page: 'min-h-screen text-white',
        pageBg: 'fixed inset-0 z-[-1] bg-black',
        header: 'bg-black pt-20 pb-16 px-6 text-center relative overflow-hidden',
        headerGlow: true,
        logoBox: 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white border-transparent shadow-2xl shadow-violet-900',
        title: 'text-white',
        subtitle: 'text-zinc-500',
        card: 'bg-zinc-900 border border-zinc-800 text-white hover:border-violet-600/60 hover:bg-zinc-800/80 shadow-xl shadow-black/20',
        serviceName: 'text-white',
        price: 'text-violet-400',
        meta: 'text-zinc-600',
        input: 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500',
        slotBtn: 'bg-zinc-900 text-white hover:bg-violet-700 border-zinc-800',
        cta: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 shadow-xl shadow-violet-900/40',
        badge: 'bg-zinc-900 text-zinc-600 text-[10px] border-zinc-800',
        backBtn: 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800',
        summaryCard: 'bg-zinc-900 border-zinc-800',
        footer: 'text-zinc-800',
        label: 'text-zinc-500',
    },
};

export default function PublicHomeUI({ tenant, services, staff }) {
    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({
        service: null,
        staff: null,
        date: DateTime.now().toISODate(),
        time: null,
    });
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingDone, setBookingDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const website = tenant.websiteConfig || {};
    const theme = tenant.theme || {};
    const variant = theme.layoutVariant || 'modern';
    const primaryColor = theme.colors?.primary || '#4f46e5';
    const t = THEMES[variant] || THEMES.modern;

    useEffect(() => {
        if (step === 3 && booking.staff && booking.service && booking.date) {
            setLoadingSlots(true);
            fetch(`/api/public/availability?slug=${tenant.slug}&staffId=${booking.staff.id}&serviceId=${booking.service.id}&date=${booking.date}`)
                .then(res => res.json())
                .then(data => { setSlots(data.slots || []); setLoadingSlots(false); });
        }
    }, [step, booking.staff, booking.service, booking.date, tenant.slug]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        const res = await fetch('/api/public/book', {
            method: 'POST',
            body: JSON.stringify({
                slug: tenant.slug,
                serviceId: booking.service.id,
                staffId: booking.staff.id,
                date: booking.date,
                time: booking.time,
                customer: { name: formData.get('name'), phone: formData.get('phone') }
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        setSubmitting(false);
        if (res.ok) {
            setBookingDone(true);
        } else {
            const err = await res.json();
            alert("Erro ao agendar: " + (err.error?.message || err.error));
        }
    };

    const inputClass = `w-full p-4 mt-1 rounded-[1.25rem] border outline-none focus:ring-4 focus:ring-current/10 transition-all font-medium ${t.input}`;
    const radius = theme.borderRadius || '1.25rem';

    if (bookingDone) return (
        <div className={t.page}>
            {t.pageBg && <div className={t.pageBg} />}
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6">
                <div
                    className="w-24 h-24 flex items-center justify-center rounded-full text-4xl shadow-2xl"
                    style={{ backgroundColor: primaryColor }}
                >
                    ✓
                </div>
                <div>
                    <h1 className={`text-3xl font-black mb-2 ${t.title}`}>Agendado! 🎉</h1>
                    <p className={`text-sm ${t.subtitle}`}>
                        Seu horário em <strong>{booking.staff?.name}</strong> para <strong>{booking.service?.name}</strong> está confirmado.
                    </p>
                </div>
                <button
                    onClick={() => { setStep(1); setBookingDone(false); setBooking({ service: null, staff: null, date: DateTime.now().toISODate(), time: null }); }}
                    className={`py-4 px-8 rounded-[${radius}] font-black uppercase tracking-widest text-sm transition-all active:scale-95 ${t.cta}`}
                >
                    Fazer Outro Agendamento
                </button>
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.footer}`}>
                    Powered by Agenda Pro
                </p>
            </div>
        </div>
    );

    return (
        <div className={t.page}>
            {t.pageBg && <div className={t.pageBg} />}

            {/* Header */}
            <header className={t.header}>
                {variant === 'modern' && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-[0.08]" style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }} />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }} />
                    </div>
                )}
                {t.headerGlow && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 opacity-20" style={{ background: `radial-gradient(ellipse, ${primaryColor}, transparent)` }} />
                    </div>
                )}
                {website.heroImageUrl && (
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={website.heroImageUrl} alt="Capa" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-current" />
                    </div>
                )}
                <div className="relative z-10">
                    <div
                        className={`w-24 h-24 mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl ${t.logoBox}`}
                        style={{ borderRadius: radius }}
                    >
                        {website.logoUrl
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={website.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            : <span className="font-black text-3xl">{tenant.name[0]}</span>
                        }
                    </div>
                    <h1 className={`text-4xl font-black tracking-tight mb-3 leading-tight ${t.title}`}>
                        {website.heroTitle || tenant.name}
                    </h1>
                    <p className={`text-sm max-w-xs mx-auto opacity-80 ${t.subtitle}`}>
                        {website.heroSubtitle || 'Especialistas em beleza e estética.'}
                    </p>
                </div>
            </header>

            <div className="max-w-md mx-auto p-6 space-y-10 pb-20">

                {/* Gallery */}
                {step === 1 && website.gallery?.length > 0 && (
                    <div className="space-y-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.label}`}>Nosso Trabalho</p>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                            {website.gallery.map((url, i) => (
                                <div key={i} className="min-w-[240px] aspect-[4/5] overflow-hidden shadow-xl group" style={{ borderRadius: radius }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 1: Services */}
                {step === 1 && (
                    <div className="space-y-4">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.label}`}>Procedimentos & Serviços</p>
                        <div className="grid gap-3">
                            {services.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setBooking({ ...booking, service: s }); setStep(2); }}
                                    className={`p-4 border transition-all text-left flex gap-4 items-center group active:scale-[0.98] ${t.card}`}
                                    style={{ borderRadius: radius }}
                                >
                                    <div className="w-16 h-16 overflow-hidden bg-zinc-100/10 flex-shrink-0 shadow-inner" style={{ borderRadius: `calc(${radius} * 0.7)` }}>
                                        {s.imageUrl
                                            // eslint-disable-next-line @next/next/no-img-element
                                            ? <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            : <div className="w-full h-full flex items-center justify-center opacity-20 text-current">⚡</div>
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-sm mb-1 ${t.serviceName}`}>{s.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 ${t.meta}`}>{s.duration} min</span>
                                            {website.showPrices !== false && (
                                                <span className={`font-black text-xs ${t.price}`}>R$ {parseFloat(s.price).toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            ))}
                            {services.length === 0 && (
                                <div className="py-16 text-center opacity-30">
                                    <p className="text-sm font-black uppercase tracking-widest">Nenhum serviço disponível</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Staff */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className={`p-3 rounded-full transition-all ${t.backBtn}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <p className={`text-xs font-black uppercase tracking-widest opacity-40 ${t.title}`}>Com quem?</p>
                        </div>
                        <div className="grid gap-3">
                            {staff.filter(st => !booking.service || st.services.some(s => s.serviceId === booking.service.id)).map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => { setBooking({ ...booking, staff: st }); setStep(3); }}
                                    className={`p-5 border text-left flex items-center gap-4 active:scale-[0.98] transition-all ${t.card}`}
                                    style={{ borderRadius: radius }}
                                >
                                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center font-black text-lg shadow-sm" style={{ borderRadius: radius, background: primaryColor, color: 'white' }}>
                                        {st.name[0]}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-sm ${t.serviceName}`}>{st.name}</h3>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${t.meta}`}>{st.location?.name || 'Unidade Principal'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Date & Time */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(2)} className={`p-3 rounded-full transition-all ${t.backBtn}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <p className={`text-xs font-black uppercase tracking-widest opacity-40 ${t.title}`}>Escolha o horário</p>
                        </div>
                        <input
                            type="date"
                            value={booking.date}
                            min={DateTime.now().toISODate()}
                            onChange={e => setBooking({ ...booking, date: e.target.value })}
                            className={`w-full p-4 rounded-[${radius}] border font-bold text-sm outline-none focus:ring-4 focus:ring-current/10 transition-all ${t.input}`}
                        />
                        {loadingSlots ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${t.label}`}>Buscando horários...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => { setBooking({ ...booking, time: slot }); setStep(4); }}
                                        className={`p-4 border font-bold text-sm active:scale-90 transition-all shadow-sm ${t.slotBtn}`}
                                        style={{ borderRadius: radius }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                                {slots.length === 0 && (
                                    <div className="col-span-3 text-center py-16 opacity-30">
                                        <p className="text-sm font-black uppercase tracking-widest">Sem horários disponíveis</p>
                                        <p className="text-xs mt-2">Tente outra data ou profissional</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(3)} className={`p-3 rounded-full transition-all ${t.backBtn}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <p className={`text-xs font-black uppercase tracking-widest opacity-40 ${t.title}`}>Finalizar Agendamento</p>
                        </div>
                        <div className={`p-6 border ${t.summaryCard}`} style={{ borderRadius: radius }}>
                            <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 ${t.label}`}>Resumo</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center font-black">
                                    <span className={t.serviceName}>{booking.service.name}</span>
                                    <span style={{ color: primaryColor }}>R$ {parseFloat(booking.service.price).toFixed(2)}</span>
                                </div>
                                <div className={`text-xs font-bold opacity-60 ${t.meta}`}>
                                    👤 {booking.staff.name} · 📅 {DateTime.fromISO(booking.date).setLocale('pt-BR').toLocaleString(DateTime.DATE_MED)} às {booking.time}
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${t.label}`}>Seu Nome</label>
                                <input name="name" required className={inputClass} placeholder="Como podemos te chamar?" />
                            </div>
                            <div>
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${t.label}`}>WhatsApp</label>
                                <input name="phone" required className={inputClass} placeholder="(00) 00000-0000" />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-5 font-black rounded-[${radius}] text-sm uppercase tracking-widest mt-4 active:scale-[0.98] transition-all ${t.cta} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <footer className="text-center p-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${t.footer}`}>
                    Tecnologia Agenda Pro
                </p>
            </footer>

            {/* WhatsApp Float */}
            {website.contactWhatsapp && (
                <a
                    href={`https://wa.me/${website.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${tenant.name}.`)}`}
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
