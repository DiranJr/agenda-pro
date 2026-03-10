# AgendaPro
# Sistema de Gestão para Prestadores de Serviços de Beleza
## Documento de Contexto, Prompt Mestre & Estado Atual do Projeto

Versão 2.0  ·  Atualizado com o projeto real enviado  ·  Março 2026

## 1. O Que Foi Implementado (V2 vs V1)
Comparando os dois arquivos ZIP enviados, as seguintes funcionalidades foram adicionadas ou alteradas:

❌ **Estado anterior (V1)**
• Apenas 3 templates (Glow, Modern, Velvet)
• Sem sistema de planos
• Sem controle de features por plano
• Sem página de check-in/balcão
• Dashboard com lógica inline na página
• Financeiro básico sem KPIs
• Sem filtro de clientes inativos
• Sem botão WhatsApp em clientes
• Sem domains/dashboard e domains/finance
• Sidebar sem lock de funcionalidades
• Sem lib/plans.js e lib/featureGating.js

✅ **Estado atual (V2)**
• 7 templates + registry system (layout-based)
• Sistema de planos: start / pro / enterprise
• hasFeature() + withFeature() middleware
• /crm/checkin completo (balcão presencial)
• DashboardRepository com nextAppointment, chartData, noShowRate, inactiveCount
• FinanceRepository com KPIs, pieChart, topStaff
• Filtro inativo 30/60/90d + lastVisit por cliente
• Botão WhatsApp com mensagem pré-formatada
• domains/dashboard e domains/finance criados
• Sidebar com Lock icon + badge de plano
• lib/plans.js + lib/featureGating.js

## 2. Visão Geral do Projeto
O AgendaPro é uma plataforma SaaS multi-tenant em Next.js 16 + Prisma + SQLite para profissionais de beleza: lash designers, barbearias, manicures, estéticas e salões.

### Stack Tecnológica
- **Framework:** Next.js 16 (App Router, React 19)
- **ORM / Banco:** Prisma 6 com SQLite (arquivo dev.db)
- **Autenticação:** JWT via jose + bcryptjs + cookies HTTP-only ("auth_token")
- **Estilização:** Tailwind CSS 4
- **Ícones:** lucide-react 0.577 | Animações: framer-motion 12
- **Datas/Timezones:** Luxon 3 — SEMPRE usar Luxon, NUNCA Date nativo
- **Notificações:** react-hot-toast
- **Porta dev:** 3016 | Seed: npm run prisma:seed
- **Credenciais seed:** admin@agendapro.com / abracadabra

## 3. Arquitetura & Estrutura de Arquivos
### 3.1 Estrutura de Pastas (Estado Atual)
Pasta / Arquivo | Responsabilidade
--- | ---
app/(public)/[slug]/ | Mini site público de agendamento do estúdio
app/api/crm/dashboard/ | 🆕 Endpoint do dashboard (DashboardRepository)
app/api/crm/finance/ | 🆕 Endpoint do financeiro (FinanceRepository)
app/crm/checkin/ | 🆕 Balcão de atendimento presencial
domains/dashboard/ | 🆕 DashboardRepository (nextAppointment, chartData, noShowRate, inactiveCount)
domains/finance/ | 🆕 FinanceRepository (KPIs, topStaff, bestService, categoryData)
lib/plans.js | 🆕 PLANS config (start/pro/enterprise) + hasFeature() + getLimit()
lib/featureGating.js | 🆕 withFeature(feature, handler) HOF para proteger APIs

## 4. Sistema de Planos (lib/plans.js)
O sistema de planos controla acesso a features e limites de uso. O campo plan é um String no model Tenant (default: "start").

Plano | Preço | Features | Limites
--- | --- | --- | ---
**start** | R$ 49/mês | basic_crm, simple_website, appointments | staff: 2, services: 10, gallery: 3
**pro** | R$ 99/mês | + advanced_crm, custom_website, finance_reports, customer_recovery | staff: 10, services: 50, gallery: 10
**enterprise** | R$ 199/mês | + multi_location, checkin_pro | staff: 999, services: 999, gallery: 50

## 10. Próximos Passos (Checklist)
1. Landing page pública completa (hero, comparação, features, preços)
2. Integrar landing page com planos reais de lib/plans.js
3. Página /crm/plano: plano atual, limites usados, upgrade
4. **Gráfico real no dashboard (recharts ou framer)**
5. Exportar CSV no financeiro (plano pro+)
6. Limitar cadastro de staff/services pelo getLimit() do plano

---
*AgendaPro v2.0 — Documento de Contexto · Março 2026*
