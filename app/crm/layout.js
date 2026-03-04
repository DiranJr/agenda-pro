"use client";
import Link from "next/link";
import { useState } from "react";

const navSections = [
    {
        title: "Operacao",
        items: [
            { href: "/crm/dashboard", label: "Agenda" },
            { href: "/crm/customers", label: "Clientes" },
            { href: "/crm/services", label: "Servicos" },
            { href: "/crm/staff", label: "Profissionais" },
        ],
    },
    {
        title: "Gestao",
        items: [
            { href: "/crm/finance", label: "Financeiro", disabled: true },
        ],
    },
    {
        title: "Configuracoes",
        items: [
            { href: "/crm/website", label: "Meu Site" },
            { href: "/crm/settings", label: "Configuracoes" },
        ],
    },
];

export default function CRMLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50">
            <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200">
                <div className="h-16 px-4 flex items-center justify-between">
                    <h1 className="text-lg font-black">
                        Agenda <span className="text-indigo-600">Pro</span>
                    </h1>
                    <button
                        type="button"
                        aria-label="Abrir menu"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="p-2 rounded-lg border border-zinc-200 text-zinc-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="lg:hidden fixed inset-0 z-30 bg-black/30"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 flex flex-col transform transition-transform duration-200 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="h-16 lg:h-auto p-6 border-b border-zinc-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-black tracking-tight">
                        Agenda <span className="text-indigo-600">Pro</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-8 mt-4 overflow-y-auto">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4 mb-4">{section.title}</h3>
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block px-4 py-2 text-sm font-medium rounded-lg ${item.disabled ? "text-zinc-400 bg-zinc-50 cursor-not-allowed pointer-events-none" : "text-zinc-700 hover:bg-zinc-100"}`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">Sair</button>
                </div>
            </aside>

            <main className="lg:ml-64 p-6 lg:p-10 pt-24 lg:pt-10">{children}</main>
        </div>
    );
}
