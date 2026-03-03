import Link from 'next/link';

export default function CRMLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-zinc-100">
                    <h1 className="text-xl font-black">Agenda <span className="text-indigo-600">Pro</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-8 mt-4">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4 mb-4">Operação</h3>
                        <ul className="space-y-1">
                            <li><Link href="/crm/dashboard" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Agenda</Link></li>
                            <li><Link href="/crm/customers" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Clientes</Link></li>
                            <li><Link href="/crm/services" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Serviços</Link></li>
                            <li><Link href="/crm/staff" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Profissionais</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4 mb-4">Gestão</h3>
                        <ul className="space-y-1">
                            <li><Link href="/crm/finance" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg opacity-50 cursor-not-allowed">Financeiro</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4 mb-4">Configurações</h3>
                        <ul className="space-y-1">
                            <li><Link href="/crm/website" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Meu Site</Link></li>
                            <li><Link href="/crm/settings" className="block px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">Configurações</Link></li>
                        </ul>
                    </div>
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">Sair</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                {children}
            </main>
        </div>
    );
}
