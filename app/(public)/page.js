import Link from "next/link";
import {
  Calendar,
  Clock,
  Smartphone,
  TrendingUp,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900">
              Agenda<span className="text-indigo-600">Pro</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-zinc-500 hover:text-indigo-600 transition-colors">Funcionalidades</a>
            <a href="#pricing" className="text-sm font-semibold text-zinc-500 hover:text-indigo-600 transition-colors">Planos</a>
            <Link href="/login" className="px-6 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-bold shadow-xl shadow-zinc-200 hover:bg-zinc-800 active:scale-95 transition-all">
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-pink-50 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-black uppercase tracking-widest animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              Sua gestão de agenda em 2025
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 leading-[1.1]">
              Transforme seu <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">negócio local</span>.
            </h1>

            <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              O sistema definitivo para profissionais de estética, beleza e saúde.
              Agendamento online, controle financeiro e site exclusivo — tudo em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/login" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase tracking-wider shadow-2xl shadow-indigo-300 hover:bg-indigo-700 hover:translate-y-[-2px] active:translate-y-0 transition-all">
                Começar agora grátis
              </Link>
              <button className="px-8 py-5 text-zinc-900 font-bold flex items-center gap-2 hover:bg-zinc-50 rounded-2xl transition-all">
                Ver demonstração <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40 grayscale pointer-events-none">
              <div className="font-black text-2xl">+500 Clientes</div>
              <div className="font-black text-2xl">99% Agendado</div>
              <div className="font-black text-2xl">24/7 Ativo</div>
              <div className="font-black text-2xl">Cloud Sync</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-50/50 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Por que escolher o Agenda Pro?</h2>
              <p className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">Tudo o que seu estúdio precisa.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock />,
                  title: "Agenda 24/7",
                  desc: "Deixe seus clientes marcarem horários até enquanto você dorme, via WhatsApp ou seu próprio site."
                },
                {
                  icon: <Smartphone />,
                  title: "App Mobile First",
                  desc: "Acesse sua agenda de qualquer lugar pelo celular com uma interface preparada para a rotina rápida."
                },
                {
                  icon: <TrendingUp />,
                  title: "Controle Financeiro",
                  desc: "Saiba exatamente quanto ganhou no dia, mês e ano. Fluxo de caixa simples para focar no seu trabalho."
                },
                {
                  icon: <Shield />,
                  title: "Sua Marca em Foco",
                  desc: "Templates exclusivos para o seu site público. Sem propaganda de terceiros, apenas sua marca."
                },
                {
                  icon: <Users />,
                  title: "Multi-Profissional",
                  desc: "Gerencie toda a sua equipe, salas e equipamentos com permissões individuais e horários separados."
                },
                {
                  icon: <CheckCircle2 />,
                  title: "Lembrete Automático",
                  desc: "Reduza o 'não comparecimento' (No-show) em até 80% com avisos profissionais via sistema."
                }
              ].map((f, i) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-3">{f.title}</h3>
                  <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Theme Banner */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden">
            {/* Animated Light Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] opacity-50" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Crie seu site profissional <br /> em 3 cliques.</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                Escolha entre nossos templates exclusivos: Glow, Velvet, Pure ou Aura.
                Seu site de agendamento pronto para receber clientes com design de luxo.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
                  Ver Templates
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Simples e Flexível</h2>
              <p className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">Preço justo para todos.</p>
            </div>

            <div className="p-10 bg-white rounded-[2.5rem] bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-600 shadow-2xl shadow-indigo-200 relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                MAIS POPULAR
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900">Plano Pro Evolution</h3>
                    <p className="text-zinc-500">Completo para seu negócio crescer.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-zinc-400 line-through">R$ 97,00</span>
                    <div className="text-4xl font-black text-zinc-900">R$ 59,90<span className="text-sm font-medium">/mês</span></div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-8">
                  {[
                    "Agenda Ilimitada",
                    "Acesso para Equipe",
                    "Controle Financeiro",
                    "Site Exclusivo (Templates)",
                    "Lembretes Automáticos",
                    "Suporte prioritário"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white scale-75">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <Link href="/login" className="block w-full py-5 bg-indigo-600 text-white rounded-2xl text-center font-black uppercase tracking-widest mt-8 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Experimentar Grátis
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-zinc-900">
              Agenda<span className="text-indigo-600">Pro</span>
            </span>
          </div>

          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
            Copyright © 2025 Agenda Pro · Feito para Profissionais de Valor.
          </p>

          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Smartphone className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Shield className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
