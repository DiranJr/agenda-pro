# 🚀 Agenda Pro - SaaS de Agendamento & Gestão

Sistema multi-tenant premium para profissionais autônomos e estúdios de beleza.

## 🛠️ Como Rodar Localmente

```bash
npm install
npx prisma db push
npm run prisma:seed
npm run dev -- -p 3016
```
Porta padrão: `3016`
Credenciais Seed: `admin@agendapro.com / abracadabra`

## 🌐 Módulos Principais

### 1. Landing Page Institucional
Página de entrada para venda do SaaS: [http://localhost:3016/](http://localhost:3016/)

### 2. Painel Administrativo (CRM)
Gestão completa do negócio:
- **Dashboard BI:** KPIs em tempo real, faturamento 7 dias e próximos agendamentos.
- **Balcão (Check-in):** Agendamento rápido para clientes presenciais (high-performance).
- **Recuperação de Clientes:** Filtros de inatividade (30/60/90 dias) e botão direto de WhatsApp.
- **Finanças Pro:** Relatórios por período, faturamento por categoria/staff e exportação CSV.
- **Editor de Site:** Configuração visual do mini-site público.

### 3. Mini-Sites Públicos
Sites de agendamento gerados dinamicamente:
- **Exemplo Josy Silva:** [http://localhost:3016/studio-josy](http://localhost:3016/studio-josy)

## 🎨 Galeria de Templates (Layouts)
O sistema conta agora com 6 layouts técnicos:
1. **Manicure Pastel (Novo):** Soft, elegante, focado em estética delicada.
2. **Barber Clean (Novo):** Premium Dark, industrial, vibes vintage.
3. **Beauty Soft:** Clássico feminino.
4. **Premium Dark:** Luxo e sofisticação.
5. **Clean Clinic:** Profissional e direto.
6. **Modern Studio:** Vibrante e enérgico.

## 👤 Como Cadastrar Novos Clientes (Tenants)
1. **Criação:** Novos tenants podem ser criados via API ou via script de seed.
2. **Setup:** Ao logar, o usuário configura seus **Serviços** e **Profissionais**.
3. **Site:** No menu "Meu Site", o usuário escolhe um dos templates comerciais e publica seu link.
4. **Planos:** O sistema suporta Trial (Start), Pro e Enterprise, com bloqueio automático de funcionalidades via Feature Gating.

## ⚙️ Stack Tecnológica
- **Next.js 16 (App Router)** & **React 19**
- **Prisma 6** com **SQLite**
- **Tailwind CSS 4** & **Framer Motion 12**
- **Luxon 3** (Controle rigoroso de Datas/Timezones)

---
*Foco total em UX e conversão para o profissional autônomo.*
