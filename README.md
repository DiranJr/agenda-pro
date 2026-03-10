# 🚀 Agenda Pro - Sistema de Templates Flexíveis

Este projeto utiliza uma arquitetura de templates desacoplada, permitindo que múltiplos estilos visuais (comerciais) compartilhem layouts técnicos robustos.

## 🛠️ Como Rodar Localmente

Certifique-se de estar na porta correta conforme configurado no ambiente:

```bash
npm run dev -- -p 3016
```

Após iniciar, o sistema estará disponível em `http://localhost:3016`.

## 🌐 URLs de Acesso

### 1. Área Pública (Sites dos Clientes)
Os sites são acessados pelo slug do cliente:
- [Studio Josy (Efeito Soft)](http://localhost:3016/studio-josy)
- [CrossFit Action (Modern Studio)](http://localhost:3016/crossfit-action)
- [Odonto Premium (Clean Clinic)](http://localhost:3016/odonto-premium)
- [Vintage Gold Barber (Premium Dark)](http://localhost:3016/vintage-barber)

### 2. Gestão do Site (CRM)
- **Configuração Visual:** `http://localhost:3016/crm/website`
  - Fluxo em passos: Estilo -> Conteúdo -> Mídias -> Publicar.
- **Preview Comparativo:** `http://localhost:3016/crm/website/preview-all`
  - Ferramenta para desenvolvedores compararem como os dados aparecem em todos os 4 layouts simultaneamente.

## 👤 Como Cadastrar Novos Clientes (Tenants)

### Passo 1: Criação no Banco de Dados
Para testes rápidos, você pode usar o script de geração de dados fictícios:
```bash
node tmp/seed-test-layouts.js
```

Para produção, o novo cliente deve ser inserido na tabela `Tenant` via Prisma ou painel administrativo (em desenvolvimento).

### Passo 2: Configuração de Conteúdo
Ao configurar o site no CRM, respeite os limites visuais para garantir a melhor experiência:
- **Nome da Marca:** Máx 30 caracteres.
- **Título (Headline):** Máx 60 caracteres.
- **Subtítulo:** Máx 140 caracteres.
- **Galeria:** Máx 8 fotos.

### Passo 3: Escolha do Template
Atualmente existem 4 layouts base que podem ser personalizados com cores infinitas:
1. **Beauty Soft:** Ideal para estética e cílios.
2. **Premium Dark:** Focado em luxo e sofisticação (Barbearias/Studios).
3. **Clean Clinic:** Para médicos, dentistas e clínicas.
4. **Modern Studio:** Enérgico e vibrante (Academias/Crossfit).

## 🔍 Validação de Dados Legados
Se precisar garantir que todos os clientes antigos estão compatíveis com os novos limites:
```bash
node tmp/validate-tenants.js
```

---
*Desenvolvido com foco em escalabilidade e performance.*
