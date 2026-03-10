"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Smartphone,
  TrendingUp,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  BarChart3,
  MessageSquare,
  Lock,
  Star,
  ChevronRight,
  ClipboardList
} from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-zinc-900 font-syne">
              Agenda<span className="text-indigo-600">Pro</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Funcionalidades</a>
            <a href="#planos" className="text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Planos</a>
            <Link href="/login" className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-zinc-200 hover:bg-zinc-800 active:scale-95 transition-all">
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* HERO SECTION */}
        <section className="relative py-24 md:py-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-pink-50 rounded-full blur-[100px] opacity-40" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto text-center space-y-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              A inteligência que seu estúdio merece
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.9] font-syne">
              Gerencie seu estúdio <br />
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent italic">com inteligência</span>.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed font-medium">
              A plataforma definitiva para Lash Designers, Barbeiros e profissionais de estética que buscam faturamento e liberdade.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <a href="#planos" className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-indigo-300 hover:bg-indigo-700 hover:scale-105 transition-all">
                Ver planos e preços
              </a>
              <button className="px-10 py-6 text-zinc-900 font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-zinc-100 rounded-[2rem] transition-all">
                Ver demonstração <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pt-12">
              {['Lash Designers', 'Barbeiros', 'Manicures', 'Estéticas', 'Salões'].map((pill) => (
                <span key={pill} className="px-5 py-2 bg-white border border-zinc-100 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest shadow-sm">
                  {pill}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* NÚMEROS DE CONFIANÇA */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Profissionais", value: "+2.400", desc: "Já usam diariamente", icon: Users },
              { label: "Economia", value: "60%", desc: "Menos tempo em gestão", icon: Clock },
              { label: "Faturamento", value: "+50%", desc: "Aumento médio anual", icon: TrendingUp },
              { label: "Falhas", value: "0%", desc: "De agendamento humano", icon: Shield },
            ].map((n, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                  <n.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-black text-zinc-900 font-syne">{n.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{n.label}</div>
                <div className="text-zinc-400 text-xs font-medium">{n.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TABELA COMPARATIVA */}
        <section className="py-32 px-6 bg-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]" />

          <div className="max-w-5xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">O Confronto</h2>
              <p className="text-4xl md:text-6xl font-black text-white tracking-tighter font-syne">Como você quer trabalhar?</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-2 text-center border-b border-white/10">
                <div className="p-8 bg-white/5 font-black text-zinc-400 uppercase tracking-widest text-xs">Sem AgendaPro</div>
                <div className="p-8 bg-indigo-600 font-black text-white uppercase tracking-widest text-xs shadow-2xl">Com AgendaPro</div>
              </div>

              {[
                ["Atendimento Manual", "Auto-atendimento 24h"],
                ["Perda de tempo no WhatsApp", "Tudo centralizado e rápido"],
                ["Esquecimento de clientes", "Lembretes Automáticos"],
                ["Faturamento estagnado", "Escalabilidade real"],
                ["Agenda de papel/bagunçada", "Link profissional exclusivo"],
                ["Falta de dados financeiros", "Relatórios e métricas em tempo real"],
                ["Dependência do dono", "Gestão de equipe autônoma"],
                ["No-shows constantes", "Taxa de falta próxima de zero"],
                ["Visual amador", "Site de luxo configurável"]
              ].map(([old, tech], i) => (
                <div key={i} className="grid grid-cols-2 text-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="p-6 text-zinc-500 text-sm font-medium border-r border-white/5 italic opacity-60">
                    {old}
                  </div>
                  <div className="p-6 text-white text-sm font-bold flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    {tech}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Arsenal de Guerra</h2>
              <p className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter font-syne">Tudo para dominar seu mercado.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Calendar, title: "Agenda Online", desc: "Seu cliente agenda sozinho em 30 segundos, direto pelo seu link exclusivo." },
                { icon: Users, title: "CRM de Clientes", desc: "Histórico completo, frequência de visitas e lembretes de retorno inteligentes." },
                { icon: MessageSquare, title: "WhatsApp Automático", desc: "Confirmações e avisos enviados via sistema para reduzir faltas." },
                { icon: BarChart3, title: "Gestão Financeira", desc: "Saiba exatamente quanto entra e sai, comissão de equipe e faturamento líquido." },
                { icon: Smartphone, title: "Multi-Dispositivo", desc: "Controle tudo pelo celular, tablet ou computador, de onde você estiver." },
                { icon: Sparkles, title: "Mini Site de Luxo", desc: "Templates configuráveis que transmitem o valor real do seu serviço." },
                { icon: Lock, title: "Segurança Total", desc: "Dados criptografados e backups diários para sua total tranquilidade." },
                { icon: ClipboardList, title: "Balcão / Check-in", desc: "Agendamento rápido para clientes presenciais com 1 clique." },
                { icon: Zap, title: "Alta Performance", desc: "Sistema ultrarrápido focado em converter visitantes em clientes pagantes." }
              ].map((f, i) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:border-indigo-100 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                  <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all relative z-10">
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-4 font-syne relative z-10">{f.title}</h3>
                  <p className="text-zinc-500 leading-relaxed text-sm relative z-10">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANOS DE PREÇO */}
        <section id="planos" className="py-32 px-6 bg-zinc-50">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Investimento</h2>
              <p className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter font-syne">Escolha sua escala.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Plano Start */}
              <div className="p-12 bg-white rounded-[3rem] border border-zinc-100 shadow-2xl relative overflow-hidden group">
                <div className="space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-zinc-900 uppercase">Plano Start</h3>
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Para quem está começando</p>
                  </div>
                  <div className="text-5xl font-black text-zinc-900 font-syne">R$ 299,99<span className="text-xs font-medium text-zinc-400">/mês</span></div>

                  <ul className="space-y-4">
                    {["Até 3 Profissionais", "Agenda Ilimitada", "Mini Site (All Layouts)", "WhatsApp de Confirmação", "Lista de Clientes", "Dash Individual"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-zinc-600 underline decoration-indigo-200 underline-offset-4 decoration-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-6 bg-zinc-100 text-zinc-900 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all">
                    Começar com Start
                  </button>
                </div>
              </div>

              {/* Plano Advanced */}
              <div className="p-12 bg-indigo-600 rounded-[3rem] shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest relative z-20">
                  Mais Recomendado
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase">Gestão Avançada</h3>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest text-white/50">Para quem domina o mercado</p>
                  </div>
                  <div className="text-5xl font-black text-white font-syne">R$ 399,99<span className="text-xs font-medium text-white/50">/mês</span></div>

                  <ul className="space-y-4">
                    {["Profissionais Ilimitados", "Múltiplas Unidades", "Financeiro Avançado", "Relatórios de Comissão", "Exportação de Dados", "Suporte 24h Prioritário"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-6 bg-white text-indigo-600 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                    Contratar Avançado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />

            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter font-syne leading-none">Pronta para o <br /> próximo nível?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                Parem de perder tempo com agendas de papel e grupos de WhatsApp.
                Recupere sua liberdade e aumente seu faturamento hoje.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5 pt-6 font-syne">
                <Link href="/login" className="px-12 py-6 bg-white text-zinc-900 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
                  Começar agora
                </Link>
                <button className="px-12 py-6 border border-white/20 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                  Ver Demonstração
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-zinc-100 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900 font-syne">
                Agenda<span className="text-indigo-600">Pro</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              O parceiro tecnológico de estúdios e profissionais de beleza que valorizam tempo, excelência e lucratividade.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Plataforma</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-bold text-zinc-900 hover:text-indigo-600">Home</a></li>
              <li><a href="#features" className="text-sm font-bold text-zinc-900 hover:text-indigo-600">Funcionalidades</a></li>
              <li><a href="#planos" className="text-sm font-bold text-zinc-900 hover:text-indigo-600">Preços</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Social</h4>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer">
                <Star className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-zinc-50 mt-20">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            © 2026 Agenda Pro · Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-indigo-600">Privacidade</a>
            <a href="#" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-indigo-600">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
