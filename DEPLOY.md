# DoneLog — Guia de Deploy

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub/GitLab/Bitbucket)

---

## T-59 — Configurar Supabase (produção)

### 1. Criar o projeto

1. Acesse https://supabase.com/dashboard
2. Clique em **New project**
3. Preencha nome, senha do banco e região mais próxima
4. Aguarde o projeto inicializar (~1 minuto)

### 2. Executar a migration

1. No painel do projeto, vá em **SQL Editor → New query**
2. Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Clique em **Run**
4. Confirme que as tabelas `areas`, `tasks` e `work_days` foram criadas em **Table Editor**

### 3. Configurar autenticação

1. Vá em **Authentication → Settings**
2. Em **Email**, habilite **Enable Email OTP** (Magic Link)
3. Em **URL Configuration**, adicione sua URL de produção (ex: `https://donelog.vercel.app`) em **Site URL** e **Redirect URLs**

### 4. Obter as credenciais

1. Vá em **Settings → API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## T-60 — Configurar variáveis no Vercel

As seguintes variáveis de ambiente são obrigatórias:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon/public do Supabase |

Configure-as em **Vercel → seu projeto → Settings → Environment Variables** para os ambientes **Production**, **Preview** e **Development**.

---

## T-61 — Deploy na Vercel

### Opção A — Import via dashboard

1. Acesse https://vercel.com/new
2. Importe o repositório Git do projeto
3. Vercel detectará automaticamente Next.js (use as configurações padrão)
4. Adicione as variáveis de ambiente do passo anterior
5. Clique em **Deploy**

### Opção B — CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Build local antes do deploy

Confirme que o build passa sem erros:

```bash
npm run build
```

---

## T-62 — Smoke test em produção

Após o deploy, valide os fluxos principais:

- [ ] Login com Magic Link (verificar e-mail chega e redireciona para `/hoje`)
- [ ] Criar tarefa no Inbox
- [ ] Mover tarefa para Kanban (verificar limite de colunas)
- [ ] Marcar tarefa como Hoje
- [ ] Fazer check-in, aguardar alguns minutos, fazer check-out
- [ ] Verificar tempo calculado corretamente
- [ ] Marcar tarefa como concluída em Hoje
- [ ] Verificar entrada no Histórico no dia seguinte
- [ ] Definir prioridade semanal (verificar limite de 5)
- [ ] Alterar limite em Configurações e verificar que o novo limite é respeitado

---

## Solução de problemas

**Build falha com erro de módulo Next.js:**
Use `node_modules/.bin/next build` em vez de `npx next build` — o npx pode pegar uma versão diferente.

**Redirect infinito após login:**
Verifique se a URL de produção está nos **Redirect URLs** do Supabase Authentication.

**Tarefas não carregam:**
Confirme que as políticas RLS estão ativas e que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas no Vercel.

**Cookie de sessão não persiste:**
O `@supabase/ssr` usa cookies — certifique-se de que o middleware está sendo executado (arquivo `src/middleware.ts` existe e o Vercel não está bloqueando o middleware).
