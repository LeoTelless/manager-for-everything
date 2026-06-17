# PRD — Sistema Pessoal de Tarefas, Prioridades, Tempo e Histórico Diário

## 1. Visão geral

Criar um sistema web pessoal para organizar tarefas profissionais, de estudo, pessoais e projetos em Kanbans separados, sem perder a visão central das prioridades do dia e da semana.

O sistema deve evitar que o usuário apenas empilhe tarefas infinitamente. Para isso, deve ter limites claros em áreas como “Hoje”, “Prioridades da Semana”, “Próximo” e “Fazendo”.

O foco do MVP é simples:

* Capturar tarefas rapidamente.
* Organizar tarefas por área.
* Definir prioridades da semana.
* Escolher poucas tarefas para o dia.
* Registrar check-in/check-out.
* Salvar histórico diário com tarefas concluídas e resumo do dia.

Este sistema será usado por apenas um usuário inicialmente.

---

## 2. Objetivo do produto

O sistema deve responder diariamente a três perguntas:

1. O que eu preciso fazer hoje?
2. Quanto tempo trabalhei ou estudei?
3. O que eu concluí ou avancei?

O objetivo não é criar um Trello complexo, um Jira pessoal ou um Notion completo. O objetivo é criar um sistema leve, direto e sustentável para uso diário.

---

## 3. Público-alvo

Usuário individual que precisa organizar tarefas de diferentes contextos:

* Trabalho/profissional
* Estudos
* Vida pessoal
* Projetos paralelos

O usuário tem dificuldade em manter sistemas muito complexos e costuma abandonar Kanbans quando eles acumulam muitas tarefas sem prioridade clara.

---

## 4. Stack recomendada

Usar uma stack simples, barata e fácil de manter.

### Frontend

* Next.js com App Router
* TypeScript
* Tailwind CSS
* shadcn/ui, se já estiver configurado ou for simples adicionar
* React Hook Form, se necessário

### Backend/Banco

* Supabase

  * Auth
  * PostgreSQL
  * Row Level Security básica

### Deploy

* Vercel

---

## 5. Escopo do MVP

O MVP deve conter as seguintes telas:

1. Hoje
2. Inbox
3. Prioridades
4. Kanbans
5. Histórico
6. Configurações simples

---

# 6. Conceitos principais

## 6.1 Área

Uma área representa um segmento da vida do usuário.

Áreas padrão:

* Profissional
* Estudos
* Pessoal
* Projetos

O sistema deve permitir criar, editar e arquivar áreas no futuro, mas no MVP pode iniciar com essas áreas fixas ou cadastráveis.

---

## 6.2 Tarefa

Uma tarefa representa algo que precisa ser feito.

Campos principais:

* id
* title
* description
* area_id
* status
* priority
* urgency
* size
* due_date
* link
* is_today
* is_week_priority
* created_at
* updated_at
* completed_at
* archived_at

### Status possíveis

* inbox
* backlog
* next
* doing
* waiting
* done
* archived

### Prioridade

* low
* medium
* high

### Urgência

* low
* medium
* high

### Tamanho

* small
* medium
* large

O tamanho é usado apenas para ajudar o usuário a planejar o dia.

---

## 6.3 Dia de trabalho

Representa o registro diário de tempo e resumo.

Campos:

* id
* date
* check_in_at
* check_out_at
* total_minutes
* summary
* created_at
* updated_at

O sistema deve permitir apenas um registro principal por data.

---

## 6.4 Histórico diário

O histórico diário é gerado a partir do dia de trabalho e das tarefas concluídas naquele dia.

Deve mostrar:

* data
* hora de entrada
* hora de saída
* total de tempo
* tarefas concluídas
* resumo escrito pelo usuário

---

# 7. Regras de produto

## 7.1 Regra da tela Hoje

A tela Hoje deve ter limite de tarefas para evitar excesso.

Regras:

* O usuário pode marcar no máximo 3 tarefas como “Hoje”.
* Idealmente, exibir uma recomendação visual:

  * 1 tarefa grande
  * ou até 2 médias
  * ou até 3 pequenas

Quando o usuário tentar adicionar uma quarta tarefa ao Hoje, exibir mensagem:

> Você já tem 3 tarefas para hoje. Para adicionar outra, remova uma tarefa atual.

---

## 7.2 Regra de prioridades da semana

A tela Prioridades deve permitir no máximo 5 tarefas marcadas como prioridade semanal.

Quando o usuário tentar adicionar uma sexta prioridade, exibir mensagem:

> Você já definiu 5 prioridades para esta semana. Para adicionar outra, remova uma prioridade atual.

---

## 7.3 Regra da coluna Próximo

Cada área deve ter limite de tarefas no status `next`.

Regra padrão:

* Máximo de 5 tarefas em “Próximo” por área.

Mensagem ao exceder:

> Esta área já tem 5 tarefas em Próximo. Mova ou arquive uma tarefa antes de adicionar outra.

---

## 7.4 Regra da coluna Fazendo

Cada área deve ter limite de tarefas no status `doing`.

Regra padrão:

* Máximo de 2 tarefas em “Fazendo” por área.

Mensagem ao exceder:

> Você já tem 2 tarefas em andamento nesta área. Conclua, mova ou pause uma delas antes de iniciar outra.

---

## 7.5 Regra da Inbox

Novas tarefas criadas rapidamente devem entrar na Inbox por padrão.

A Inbox serve para capturar ideias e pendências sem bagunçar os Kanbans.

Na Inbox, o usuário deve conseguir:

* editar título;
* escolher área;
* mover para backlog;
* mover para próximo;
* arquivar;
* excluir.

---

## 7.6 Regra de conclusão

Quando uma tarefa for movida para `done`, o sistema deve preencher automaticamente `completed_at` com a data/hora atual.

Se uma tarefa sair de `done`, limpar `completed_at`.

---

## 7.7 Regra de histórico

Ao acessar o Histórico, o sistema deve listar os dias anteriores e mostrar:

* data;
* tempo total;
* tarefas concluídas naquele dia;
* resumo do dia.

As tarefas concluídas devem ser buscadas por `completed_at`.

---

# 8. Telas e funcionalidades

## 8.1 Tela Hoje

Rota sugerida:

`/hoje`

Esta deve ser a tela principal do sistema.

### Elementos

* Saudação simples
* Data atual
* Botão de check-in
* Botão de check-out
* Tempo total do dia
* Lista de tarefas marcadas para hoje
* Campo de resumo do dia
* Botão “Finalizar dia”

### Comportamento

Se ainda não houve check-in no dia:

* Mostrar botão “Fazer check-in”.

Se já houve check-in e não houve check-out:

* Mostrar horário de entrada.
* Mostrar botão “Fazer check-out”.
* Mostrar contador de tempo do dia.

Se já houve check-out:

* Mostrar horário de entrada, saída e total.

### Tarefas de Hoje

Mostrar tarefas com `is_today = true` e status diferente de `done` e `archived`.

Cada tarefa deve permitir:

* marcar como fazendo;
* marcar como concluída;
* remover de hoje;
* abrir edição rápida.

### Finalizar dia

Ao clicar em “Finalizar dia”:

* Se não houver check-out, sugerir fazer check-out.
* Salvar o resumo do dia.
* Mostrar uma prévia do histórico diário:

  * tempo total;
  * tarefas concluídas;
  * resumo escrito.

---

## 8.2 Tela Inbox

Rota sugerida:

`/inbox`

### Objetivo

Permitir captura rápida de tarefas e triagem.

### Elementos

* Campo rápido: “Adicionar tarefa”
* Lista de tarefas com status `inbox`
* Filtros simples, se necessário

### Ações por tarefa

* Definir área
* Mover para backlog
* Mover para próximo
* Marcar como hoje
* Arquivar
* Excluir
* Editar

---

## 8.3 Tela Prioridades

Rota sugerida:

`/prioridades`

### Objetivo

Mostrar as prioridades da semana em uma lista curta.

### Elementos

* Lista de até 5 tarefas marcadas como `is_week_priority = true`
* Botão para adicionar tarefa existente como prioridade
* Botão para remover tarefa da lista de prioridades
* Indicador visual: “3/5 prioridades definidas”

### Comportamento

A tela deve ajudar o usuário a decidir o que realmente importa na semana.

Pode exibir também sugestões de tarefas com:

* prioridade alta;
* urgência alta;
* prazo próximo;
* status `next` ou `backlog`.

---

## 8.4 Tela Kanbans

Rota sugerida:

`/kanbans`

### Objetivo

Organizar tarefas por área.

### Estrutura

A tela deve permitir selecionar uma área:

* Profissional
* Estudos
* Pessoal
* Projetos

Para cada área, mostrar um Kanban com as colunas:

* Backlog
* Próximo
* Fazendo
* Aguardando
* Concluído

### Colunas

#### Backlog

Tarefas com status `backlog`.

#### Próximo

Tarefas com status `next`.

Limite: 5 tarefas por área.

#### Fazendo

Tarefas com status `doing`.

Limite: 2 tarefas por área.

#### Aguardando

Tarefas com status `waiting`.

#### Concluído

Tarefas com status `done`.

Mostrar apenas tarefas concluídas recentemente, por exemplo nos últimos 14 ou 30 dias, para evitar coluna gigante.

### Ações do Kanban

O usuário deve conseguir:

* criar tarefa dentro de uma área;
* mover tarefa entre colunas;
* editar tarefa;
* marcar como hoje;
* marcar como prioridade da semana;
* arquivar tarefa;
* excluir tarefa.

Drag and drop é desejável, mas não obrigatório no primeiro MVP.

Se drag and drop for complexo, pode usar botões de ação:

* Mover para Próximo
* Mover para Fazendo
* Mover para Aguardando
* Concluir

---

## 8.5 Tela Histórico

Rota sugerida:

`/historico`

### Objetivo

Mostrar o registro dos dias anteriores.

### Elementos

Lista agrupada por dia.

Para cada dia:

* Data
* Entrada
* Saída
* Total de tempo
* Tarefas concluídas
* Resumo do dia

### Exemplo visual

16/06/2026

Entrada: 09:12
Saída: 18:04
Total: 08h52min

Tarefas concluídas:

* Ajustar prompt do agente de salas
* Organizar links da Cloudinary
* Testar renderização de imagens

Resumo:

Hoje avancei no ajuste do agente para enviar links de imagens das salas junto com as respostas. Também organizei os links públicos da Cloudinary e testei o fluxo de renderização.

---

## 8.6 Tela Configurações

Rota sugerida:

`/configuracoes`

### MVP

Configurações simples:

* Nome do usuário
* Limite de tarefas em Hoje
* Limite de prioridades semanais
* Limite de tarefas em Próximo
* Limite de tarefas em Fazendo

Valores padrão:

* Hoje: 3
* Prioridades semanais: 5
* Próximo por área: 5
* Fazendo por área: 2

---

# 9. Dashboard mínimo

Não criar dashboard complexo no MVP.

Na tela Hoje ou Histórico, exibir apenas métricas simples:

* Tempo trabalhado hoje
* Tarefas concluídas hoje
* Tempo trabalhado na semana
* Tarefas concluídas na semana

Nada além disso no MVP.

---

# 10. Modelo de banco de dados

## 10.1 Tabela `areas`

```sql
create table areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

Registros iniciais:

```sql
insert into areas (name, slug) values
('Profissional', 'profissional'),
('Estudos', 'estudos'),
('Pessoal', 'pessoal'),
('Projetos', 'projetos');
```

---

## 10.2 Tabela `tasks`

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  area_id uuid references areas(id),
  status text not null default 'inbox',
  priority text not null default 'medium',
  urgency text not null default 'medium',
  size text not null default 'medium',
  due_date date,
  link text,
  is_today boolean not null default false,
  is_week_priority boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  archived_at timestamp with time zone
);
```

Status permitidos:

* inbox
* backlog
* next
* doing
* waiting
* done
* archived

Priority permitidos:

* low
* medium
* high

Urgency permitidos:

* low
* medium
* high

Size permitidos:

* small
* medium
* large

---

## 10.3 Tabela `work_days`

```sql
create table work_days (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  check_in_at timestamp with time zone,
  check_out_at timestamp with time zone,
  total_minutes integer default 0,
  summary text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

# 11. Regras de cálculo

## 11.1 Total de tempo do dia

Quando o usuário fizer check-out:

```text
total_minutes = diferença em minutos entre check_out_at e check_in_at
```

No MVP, considerar apenas uma sessão por dia.

Não implementar múltiplas sessões no começo.

---

## 11.2 Tempo da semana

Somar `total_minutes` dos registros em `work_days` entre segunda-feira e domingo da semana atual.

---

## 11.3 Tarefas concluídas hoje

Buscar tarefas com `completed_at` dentro do dia atual.

---

## 11.4 Tarefas concluídas na semana

Buscar tarefas com `completed_at` dentro da semana atual.

---

# 12. UX e interface

## 12.1 Direção visual

A interface deve ser limpa, rápida e sem excesso visual.

Priorizar:

* poucos elementos por tela;
* botões claros;
* cards simples;
* tipografia legível;
* contraste bom;
* layout responsivo.

Evitar:

* dashboards complexos;
* excesso de gráficos;
* telas poluídas;
* animações desnecessárias;
* gamificação infantil.

---

## 12.2 Layout base

Usar layout com sidebar lateral no desktop.

Menu lateral:

* Hoje
* Inbox
* Prioridades
* Kanbans
* Histórico
* Configurações

No mobile, pode virar menu superior ou drawer.

---

## 12.3 Componentes principais

Criar componentes reutilizáveis:

* `TaskCard`
* `TaskForm`
* `TaskQuickCreate`
* `KanbanColumn`
* `TodayTaskList`
* `CheckInOutCard`
* `WeeklyPrioritiesList`
* `HistoryDayCard`
* `MetricCard`
* `Sidebar`

---

# 13. Validações importantes

## 13.1 Criar tarefa

A tarefa deve ter pelo menos:

* título

Campos opcionais:

* área
* descrição
* prioridade
* urgência
* tamanho
* prazo
* link

Se a tarefa for criada sem área, ela deve permanecer na Inbox.

---

## 13.2 Mover tarefa para Hoje

Antes de marcar `is_today = true`, verificar se o usuário já tem 3 tarefas marcadas para hoje.

Se tiver atingido o limite, bloquear a ação.

---

## 13.3 Marcar prioridade semanal

Antes de marcar `is_week_priority = true`, verificar se já existem 5 prioridades semanais.

Se tiver atingido o limite, bloquear a ação.

---

## 13.4 Mover para Próximo

Antes de mover para `status = next`, verificar quantas tarefas daquela área já estão em `next`.

Se tiver atingido o limite, bloquear.

---

## 13.5 Mover para Fazendo

Antes de mover para `status = doing`, verificar quantas tarefas daquela área já estão em `doing`.

Se tiver atingido o limite, bloquear.

---

## 13.6 Concluir tarefa

Ao mover para `done`:

* definir `completed_at = now()`;
* definir `is_today = false`;
* manter `is_week_priority` como está ou perguntar depois.

No MVP, pode manter `is_week_priority` como está, mas visualmente tarefas concluídas não devem aparecer nas prioridades ativas.

---

# 14. Fora do escopo do MVP

Não implementar agora:

* Integração com GitHub
* Integração com Google Calendar
* IA para priorização
* IA para gerar brag document automático
* Upload de arquivos
* Times ou múltiplos usuários
* Notificações
* Aplicativo mobile nativo
* Relatórios avançados
* Múltiplas sessões de trabalho por dia
* Pomodoro
* Tags complexas
* Subtarefas
* Comentários
* Compartilhamento
* Permissões avançadas

---

# 15. Melhorias futuras

Após o MVP estar funcionando, considerar:

## Fase 2

* Múltiplas sessões de trabalho no mesmo dia
* Timer vinculado a uma tarefa
* Brag document semanal
* Campo de evidências por tarefa
* Links de commits, PRs, documentos e prints
* Exportação do histórico em Markdown

## Fase 3

* Integração com GitHub
* Sugestão automática de brag document com base em commits
* Revisão semanal automática
* Métricas por área
* Metas semanais
* Modo foco

---

# 16. Critérios de aceite

O MVP será considerado pronto quando o usuário conseguir:

1. Criar tarefas rapidamente na Inbox.
2. Mover tarefas da Inbox para uma área.
3. Visualizar Kanbans separados por área.
4. Mover tarefas entre Backlog, Próximo, Fazendo, Aguardando e Concluído.
5. Marcar no máximo 3 tarefas para Hoje.
6. Marcar no máximo 5 prioridades semanais.
7. Fazer check-in e check-out no dia.
8. Ver o total de tempo trabalhado no dia.
9. Escrever e salvar o resumo do dia.
10. Visualizar histórico com tempo, tarefas concluídas e resumo.
11. Ver métricas simples de hoje e da semana.
12. Usar o sistema sem depender de integrações externas.

---

# 17. Prompt de desenvolvimento para Claude Code

Desenvolva um sistema web pessoal chamado DoneLog usando Next.js, TypeScript, Tailwind CSS e Supabase.

O sistema deve seguir esta PRD.

Priorize um MVP simples, funcional e barato de manter.

Não implemente funcionalidades fora do escopo do MVP.

A aplicação deve ter as seguintes rotas:

* `/hoje`
* `/inbox`
* `/prioridades`
* `/kanbans`
* `/historico`
* `/configuracoes`

Implemente:

* CRUD de tarefas
* Kanban por área
* Inbox
* Prioridades semanais com limite
* Tarefas de hoje com limite
* Check-in/check-out diário
* Histórico diário
* Métricas simples

Use componentes reutilizáveis, código organizado e tipado.

Antes de criar qualquer integração complexa, garanta que o fluxo principal esteja funcionando:

Inbox → Kanban → Prioridades → Hoje → Check-in/check-out → Histórico.

Não adicione IA, GitHub, calendário, notificações, upload ou recursos avançados no MVP.
