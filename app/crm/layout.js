"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Calendar,
    Users,
    Settings,
    Globe,
    Scissors,
    LogOut,
    Menu,
    X,
    Search,
    Plus,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/core";

const navSections = [
    {
        title: "Operação",
        items: [
            { href: "/crm/dashboard", label: "Agenda", icon: Calendar },
            { href: "/crm/customers", label: "Clientes", icon: Users },
            { href: "/crm/services", label: "Serviços", icon: Scissors },
            { href: "/crm/staff", label: "Equipe", icon: Users }, // Mudado de Profissionais para Equipe
        ],
    },
    {
        title: "Gestão",
        items: [
            { href: "/crm/finance", label: "Financeiro", icon: BarChart3, disabled: true },
        ],
    },
    {
        title: "Configurações",
        items: [
            { href: "/crm/website", label: "Meu Site", icon: Globe },
            { href: "/crm/settings", label: "Ajustes", icon: Settings },
        ],
    },
];

export default function CRMLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 h-20 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-black tracking-tight">
                        Agenda <span className="text-indigo-600">Pro</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-3 bg-zinc-50 rounded-2xl text-zinc-500 border border-zinc-100"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm lg:hidden transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-100 flex flex-col transform transition-all duration-500 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none",
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none mb-1">
                                Agenda <span className="text-indigo-600">Pro</span>
                            </h1>
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-300">Painel Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-10 overflow-y-auto pb-10 custom-scrollbar">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-4 mb-6">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "group flex items-center gap-4 px-4 py-4 text-sm font-bold rounded-2xl transition-all relative overflow-hidden",
                                                    isActive
                                                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                                        : item.disabled
                                                            ? "text-zinc-300 cursor-not-allowed grayscale pointer-events-none"
                                                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                                )}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-full" />
                                                )}
                                                <Icon className={cn(
                                                    "w-5 h-5 transition-transform group-hover:scale-110",
                                                    isActive ? "text-indigo-600" : "text-zinc-400"
                                                )} />
                                                {item.label}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                    <button className="w-full transition-all flex items-center gap-4 px-6 py-4 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl group">
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Desktop Main Header / Topbar */}
            <div className="lg:ml-72 flex flex-col min-h-screen">
                <header className="hidden lg:flex sticky top-0 z-30 h-24 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-12 items-center justify-between">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar clientes, serviços ou horários..."
                                className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button size="md" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Agendamento
                        </Button>

                        <div className="h-10 w-[1px] bg-zinc-100" />

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-black text-zinc-900 leading-none mb-1">Studio Josy Silva</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Plano Pro</p>
                            </div>
                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm font-black text-zinc-400">
                                JS
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 lg:p-12 pt-28 lg:pt-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
