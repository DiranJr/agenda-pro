"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@agendapro.com");
    const [password, setPassword] = useState("abracadabra");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
        });

        if (res.ok) {
            setMessage("Login realizado! Redirecionando...");
            window.location.href = "/crm/dashboard";
        } else {
            const data = await res.json();
            setMessage("Erro: " + data.error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF] p-6">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none mb-2">
                            Agenda <span className="text-indigo-600">Pro</span>
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-300 italic italic">Acesse seu painel administrativo</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-10 -mt-10" />

                    <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1 block">E-mail Corporativo</label>
                            <input
                                type="email"
                                value={email}
                                required
                                placeholder="exemplo@agendapro.com"
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 p-5 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1 block">Sua Senha</label>
                            <input
                                type="password"
                                value={password}
                                required
                                placeholder="••••••••••••"
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 p-5 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                        >
                            Autenticar no Sistema
                        </button>
                    </form>

                    {message && (
                        <div className={cn(
                            "mt-8 p-4 rounded-xl text-center text-[11px] font-bold uppercase tracking-widest",
                            message.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                            {message}
                        </div>
                    )}
                </div>

                <p className="mt-12 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
                    Protegido por criptografia de ponta a ponta<br />
                    © 2026 Agenda Pro v0.1.0
                </p>
            </div>
        </div>
    );
}
