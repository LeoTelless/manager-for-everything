-- ─────────────────────────────────────────────────────────────────────────────
-- DoneLog — Migration 001: Schema inicial
--
-- Execute este arquivo no Supabase SQL Editor:
-- https://supabase.com/dashboard → seu projeto → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type task_status as enum (
  'inbox', 'backlog', 'next', 'doing', 'waiting', 'done', 'archived'
);

create type task_priority as enum ('low', 'medium', 'high');
create type task_urgency  as enum ('low', 'medium', 'high');
create type task_size     as enum ('small', 'medium', 'large');

-- ─── Tabela: areas ───────────────────────────────────────────────────────────

create table areas (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  color      text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Seed das 4 áreas padrão
insert into areas (name, slug) values
  ('Profissional', 'profissional'),
  ('Estudos',      'estudos'),
  ('Pessoal',      'pessoal'),
  ('Projetos',     'projetos');

-- ─── Tabela: tasks ───────────────────────────────────────────────────────────

create table tasks (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  area_id          uuid references areas(id) on delete set null,
  status           task_status not null default 'inbox',
  priority         task_priority not null default 'medium',
  urgency          task_urgency  not null default 'medium',
  size             task_size     not null default 'medium',
  due_date         date,
  link             text,
  is_today         boolean not null default false,
  is_week_priority boolean not null default false,
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now(),
  completed_at     timestamp with time zone,
  archived_at      timestamp with time zone
);

-- ─── Tabela: work_days ───────────────────────────────────────────────────────

create table work_days (
  id            uuid primary key default gen_random_uuid(),
  date          date not null unique,
  check_in_at   timestamp with time zone,
  check_out_at  timestamp with time zone,
  total_minutes integer default 0,
  summary       text,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- ─── Trigger: updated_at automático ──────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger areas_updated_at
  before update on areas
  for each row execute function set_updated_at();

create trigger tasks_updated_at
  before update on tasks
  for each row execute function set_updated_at();

create trigger work_days_updated_at
  before update on work_days
  for each row execute function set_updated_at();

-- ─── Índices ─────────────────────────────────────────────────────────────────

create index tasks_status_idx          on tasks(status);
create index tasks_area_id_idx         on tasks(area_id);
create index tasks_is_today_idx        on tasks(is_today) where is_today = true;
create index tasks_is_week_priority_idx on tasks(is_week_priority) where is_week_priority = true;
create index tasks_completed_at_idx    on tasks(completed_at) where completed_at is not null;
create index work_days_date_idx        on work_days(date);

-- ─── Row Level Security (RLS) ────────────────────────────────────────────────
-- Sistema para usuário único: RLS habilitado mas política permissiva para
-- o usuário autenticado. Quando auth for implementada, estas políticas
-- filtrarão por auth.uid().

alter table areas     enable row level security;
alter table tasks     enable row level security;
alter table work_days enable row level security;

-- Políticas temporárias (acesso total para usuário autenticado)
-- Serão substituídas por user_id quando a auth for configurada.

create policy "areas: authenticated full access"
  on areas for all
  to authenticated
  using (true)
  with check (true);

create policy "tasks: authenticated full access"
  on tasks for all
  to authenticated
  using (true)
  with check (true);

create policy "work_days: authenticated full access"
  on work_days for all
  to authenticated
  using (true)
  with check (true);
