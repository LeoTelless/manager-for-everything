# ROADMAP — DoneLog MVP

Sistema pessoal de gestão de tarefas, prioridades, tempo e histórico diário.

Fluxo principal: **Inbox → Kanban → Prioridades → Hoje → Check-in/check-out → Histórico**

---

## Legenda

- `[ ]` Não iniciada
- `[x]` Concluída

---

## Fase 0 — Setup do projeto

> Scaffolding completo da aplicação antes de qualquer funcionalidade.

- [x] T-01: Criar projeto Next.js com App Router e TypeScript (`npx create-next-app`)
- [x] T-02: Configurar Tailwind CSS
- [x] T-03: Instalar e configurar shadcn/ui (componentes base: Button, Input, Card, Dialog, Badge, Select, Textarea)
- [x] T-04: Configurar Supabase (instalar `@supabase/supabase-js`, criar client, variáveis de ambiente)
- [x] T-05: Criar estrutura de pastas do projeto (`app/`, `components/`, `lib/`, `types/`)
- [x] T-06: Criar layout base com Sidebar (links para todas as rotas do MVP)
- [x] T-07: Criar páginas vazias para cada rota (`/hoje`, `/inbox`, `/prioridades`, `/kanbans`, `/historico`, `/configuracoes`)

---

## Fase 1 — Banco de dados e autenticação

> Estrutura de dados no Supabase antes de qualquer tela funcional.

- [x] T-08: Criar tabela `areas` com seed das 4 áreas padrão (Profissional, Estudos, Pessoal, Projetos)
- [x] T-09: Criar tabela `tasks` com todos os campos definidos na PRD
- [x] T-10: Criar tabela `work_days`
- [x] T-11: Configurar Row Level Security (RLS) básica nas 3 tabelas
- [x] T-12: Criar tipos TypeScript para `Area`, `Task`, `WorkDay` em `types/index.ts`
- [x] T-13: Criar funções de acesso ao Supabase em `lib/supabase/` (queries para tasks, areas, work_days)
- [x] T-14: Configurar autenticação Supabase (login com email/senha ou magic link)
- [x] T-15: Criar middleware de proteção de rotas (redirecionar para login se não autenticado)

---

## Fase 2 — Tela Inbox

> Primeira tela funcional. Valida o fluxo de criação e manipulação de tarefas.

- [x] T-16: Criar componente `TaskQuickCreate` (campo de texto + Enter para salvar)
- [x] T-17: Criar componente `TaskCard` (exibe título, área, status, ações rápidas)
- [x] T-18: Implementar listagem de tarefas com `status = inbox`
- [x] T-19: Implementar criação rápida de tarefa (status `inbox` por padrão)
- [x] T-20: Implementar ações por tarefa: definir área, mover para backlog, mover para próximo
- [x] T-21: Implementar ações: marcar como hoje (com validação de limite 3), arquivar, excluir
- [x] T-22: Criar componente `TaskForm` (edição completa: título, descrição, área, prioridade, urgência, tamanho, prazo, link)
- [x] T-23: Implementar edição de tarefa via modal/drawer

---

## Fase 3 — Tela Kanbans

> Organização visual de tarefas por área com regras de limite.

- [x] T-24: Criar componente `KanbanColumn` (título, contador, lista de cards, botão adicionar)
- [x] T-25: Implementar seletor de área (tabs ou dropdown) para filtrar o Kanban
- [x] T-26: Implementar Kanban com colunas: Backlog, Próximo, Fazendo, Aguardando, Concluído
- [x] T-27: Implementar validação de limite: máx. 5 tarefas em `next` por área
- [x] T-28: Implementar validação de limite: máx. 2 tarefas em `doing` por área
- [x] T-29: Implementar ações de mover tarefa entre colunas (botões de ação por card)
- [x] T-30: Filtrar coluna Concluído para exibir apenas tarefas dos últimos 30 dias
- [x] T-31: Implementar criação de tarefa diretamente dentro de uma área/coluna

---

## Fase 4 — Tela Hoje

> Tela principal do uso diário. Check-in, check-out, tarefas do dia.

- [x] T-32: Criar componente `CheckInOutCard` (botão check-in, horário de entrada, botão check-out, contador de tempo)
- [x] T-33: Implementar lógica de check-in (criar/buscar `work_day` do dia, registrar `check_in_at`)
- [x] T-34: Implementar lógica de check-out (registrar `check_out_at`, calcular `total_minutes`)
- [x] T-35: Criar componente `TodayTaskList` (lista tarefas com `is_today = true` e status != done/archived)
- [x] T-36: Implementar ações por tarefa no Hoje: marcar como fazendo, marcar como concluída, remover de hoje
- [x] T-37: Implementar campo de resumo do dia (textarea vinculado ao `work_day.summary`)
- [x] T-38: Implementar botão "Finalizar dia" (validar check-out, salvar resumo, exibir prévia do histórico)
- [x] T-39: Exibir métricas simples: tempo trabalhado hoje, tarefas concluídas hoje

---

## Fase 5 — Tela Prioridades

> Lista semanal com limite de 5 tarefas e sugestões.

- [x] T-40: Criar componente `WeeklyPrioritiesList` (lista até 5 tarefas com `is_week_priority = true`)
- [x] T-41: Implementar indicador visual "X/5 prioridades definidas"
- [x] T-42: Implementar adicionar tarefa existente como prioridade semanal (buscar tarefas elegíveis)
- [x] T-43: Implementar validação de limite: máx. 5 prioridades semanais
- [x] T-44: Implementar remover tarefa da lista de prioridades
- [x] T-45: Implementar seção de sugestões (tarefas com prioridade alta, urgência alta ou prazo próximo)

---

## Fase 6 — Tela Histórico

> Registro dos dias anteriores com tempo, tarefas e resumo.

- [x] T-46: Criar componente `HistoryDayCard` (data, entrada, saída, total, tarefas concluídas, resumo)
- [x] T-47: Implementar listagem de `work_days` ordenados por data desc
- [x] T-48: Para cada dia, buscar tarefas com `completed_at` dentro daquela data
- [x] T-49: Exibir métricas da semana: tempo total e tarefas concluídas na semana atual

---

## Fase 7 — Tela Configurações

> Limites configuráveis pelo usuário.

- [x] T-50: Criar tabela `settings` no Supabase (ou usar localStorage para MVP simples)
- [x] T-51: Implementar formulário de configurações: nome do usuário, limite Hoje, limite Prioridades, limite Próximo, limite Fazendo
- [x] T-52: Persistir configurações e aplicar os limites configurados nas validações das fases 2-5

---

## Fase 8 — Métricas e polimento

> Fechar o MVP com qualidade e consistência visual.

- [x] T-53: Criar componente `MetricCard` (tempo hoje, tarefas hoje, tempo semana, tarefas semana)
- [x] T-54: Revisar responsividade em mobile (Sidebar vira drawer/menu inferior)
- [x] T-55: Revisar mensagens de erro/validação em todas as regras de limite
- [x] T-56: Revisar estados vazios (telas sem tarefas, dia sem check-in, histórico vazio)
- [x] T-57: Revisar tipagem TypeScript (eliminar `any`, garantir types corretos)
- [x] T-58: Revisar acessibilidade básica (labels, contraste, foco de teclado)

---

## Fase 9 — Deploy

> Publicar o sistema em produção.

- [x] T-59: Configurar projeto no Supabase (produção) com tabelas e RLS
- [x] T-60: Configurar variáveis de ambiente no Vercel
- [x] T-61: Deploy na Vercel (conectar repositório, build automático)
- [x] T-62: Smoke test em produção: criar tarefa, fazer check-in/out, ver histórico

---

## Resumo das fases

| Fase | Descrição | Tarefas |
|------|-----------|---------|
| 0 | Setup do projeto | T-01 a T-07 |
| 1 | Banco de dados e autenticação | T-08 a T-15 |
| 2 | Tela Inbox | T-16 a T-23 |
| 3 | Tela Kanbans | T-24 a T-31 |
| 4 | Tela Hoje | T-32 a T-39 |
| 5 | Tela Prioridades | T-40 a T-45 |
| 6 | Tela Histórico | T-46 a T-49 |
| 7 | Tela Configurações | T-50 a T-52 |
| 8 | Métricas e polimento | T-53 a T-58 |
| 9 | Deploy | T-59 a T-62 |

**Total: 62 tarefas**
