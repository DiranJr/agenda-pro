"use client";
import { useState } from "react";

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
        <div className="flex items-center justify-center min-h-screen bg-zinc-50">
            <form onSubmit={handleLogin} className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm w-full max-w-sm">
                <h1 className="text-2xl font-black mb-6">Login Admin</h1>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full border p-3 rounded-lg mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-zinc-400">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border p-3 rounded-lg mt-1"
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-bold">Entrar</button>
                </div>
                {message && <p className="mt-4 text-sm text-center">{message}</p>}
            </form>
        </div>
    );
}
