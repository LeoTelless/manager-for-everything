# DESIGN SYSTEM — DoneLog

Referência visual e de estilo para toda a interface do DoneLog.

---

## 1. Filosofia visual

A interface deve ter a sensação de um ambiente **dark, focado e silencioso** — como trabalhar no escuro com um terminal bem configurado. Sem ruído, sem distração.

Inspiração direta: dark desktop environments com tema florestal noturno (tons de verde-escuro, preto profundo, névoa, naturalidade).

Princípios:
- **Densidade baixa**: poucos elementos por tela
- **Contraste funcional**: texto sempre legível, hierarquia clara
- **Sem ornamento**: nenhum elemento que não sirva à função
- **Escuridão como conforto**: o dark não é só tema, é a personalidade

---

## 2. Paleta de cores

### Backgrounds

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-base` | `#0a0c0e` | Background principal da aplicação |
| `bg-surface` | `#111416` | Cards, painéis, sidebar |
| `bg-elevated` | `#181b1f` | Modais, dropdowns, hover states |
| `bg-subtle` | `#1e2226` | Inputs, colunas de kanban, separadores |

### Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `text-primary` | `#e8eaed` | Texto principal, títulos |
| `text-secondary` | `#8a9099` | Subtítulos, metadata, labels |
| `text-muted` | `#4a5260` | Placeholders, desabilitado |
| `text-inverse` | `#0a0c0e` | Texto sobre fundos claros |

### Accent (extraído dos elementos cyan/azul da UI)

| Token | Hex | Uso |
|-------|-----|-----|
| `accent-primary` | `#3b9eff` | Botões primários, seleção ativa, links |
| `accent-hover` | `#5fb0ff` | Hover do accent |
| `accent-muted` | `#1a3d5c` | Background de badges accent, seleção suave |

### Status e semântica

| Token | Hex | Uso |
|-------|-----|-----|
| `status-doing` | `#3b9eff` | Tarefas em andamento (azul) |
| `status-done` | `#4caf7d` | Tarefas concluídas (verde) |
| `status-waiting` | `#e8a838` | Tarefas aguardando (âmbar) |
| `status-archived` | `#4a5260` | Tarefas arquivadas (cinza) |
| `danger` | `#e05c5c` | Ações destrutivas, erros |
| `warning` | `#e8a838` | Avisos de limite, alertas |
| `success` | `#4caf7d` | Confirmações, check-in ativo |

### Prioridade

| Token | Hex | Uso |
|-------|-----|-----|
| `priority-high` | `#e05c5c` | Prioridade alta |
| `priority-medium` | `#e8a838` | Prioridade média |
| `priority-low` | `#4a5260` | Prioridade baixa |

### Bordas e separadores

| Token | Hex | Uso |
|-------|-----|-----|
| `border-default` | `#1e2226` | Bordas de cards, inputs |
| `border-subtle` | `#161a1e` | Separadores internos |
| `border-focus` | `#3b9eff` | Foco de input, seleção |

---

## 3. Tipografia

### Fonte

```
Font family: Inter, system-ui, -apple-system, sans-serif
```

Inter é a fonte padrão — legível, moderna, bem suportada. Não usar fontes serif.

### Escala tipográfica

| Token | Size | Weight | Line-height | Uso |
|-------|------|--------|-------------|-----|
| `text-xs` | 11px | 400 | 1.4 | Metadata, timestamps, badges |
| `text-sm` | 13px | 400 | 1.5 | Labels, descrições, corpo secundário |
| `text-base` | 15px | 400 | 1.6 | Corpo principal, títulos de cards |
| `text-lg` | 18px | 500 | 1.4 | Títulos de seção |
| `text-xl` | 22px | 600 | 1.3 | Títulos de tela |
| `text-2xl` | 28px | 700 | 1.2 | Métricas, números de destaque |

### Regras

- Títulos de tela: `text-xl`, `font-semibold`, `text-primary`
- Títulos de seção/coluna: `text-lg`, `font-medium`, `text-primary`
- Corpo de cards: `text-base`, `font-normal`, `text-primary`
- Metadata (área, data, status): `text-xs`, `font-normal`, `text-secondary`
- Placeholders: `text-sm`, `text-muted`

---

## 4. Espaçamento

Sistema baseado em múltiplos de 4px (compatível com Tailwind padrão).

| Token | Value | Uso |
|-------|-------|-----|
| `space-1` | 4px | Espaço interno mínimo, gap entre ícone e label |
| `space-2` | 8px | Padding de badges, gap entre elementos inline |
| `space-3` | 12px | Padding de botões pequenos |
| `space-4` | 16px | Padding de cards, inputs |
| `space-5` | 20px | Gap entre cards |
| `space-6` | 24px | Padding de seções |
| `space-8` | 32px | Margem entre blocos maiores |
| `space-12` | 48px | Espaçamento de tela |

---

## 5. Bordas e raios

| Token | Value | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Badges, chips pequenos |
| `radius-md` | 8px | Cards, inputs, botões |
| `radius-lg` | 12px | Modais, painéis |
| `radius-xl` | 16px | Drawer mobile, cards grandes |
| `radius-full` | 9999px | Avatares, indicadores circulares |

---

## 6. Sombras

Sombras sutis — o dark design não precisa de sombras pesadas.

| Token | Value | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Cards em repouso |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Cards em hover, modais |
| `shadow-focus` | `0 0 0 2px #3b9eff40` | Foco de inputs e botões |

---

## 7. Componentes

### TaskCard

```
Background: bg-surface
Border: 1px solid border-default
Border-radius: radius-md
Padding: space-4
Gap interno: space-2

Hover: bg-elevated, border-color border-focus (sutil, 30% opacidade)

Estrutura:
  [Título]           text-base, text-primary
  [Área · Status]    text-xs, text-secondary
  [Badges]           priority, size
```

### KanbanColumn

```
Background: bg-subtle
Border-radius: radius-lg
Padding: space-4
Min-width: 280px
Max-width: 320px

Header:
  [Nome da coluna]   text-sm, font-medium, text-secondary, uppercase, letter-spacing 0.05em
  [Contador]         text-xs badge, bg-elevated, text-muted

Quando no limite: header com cor warning
```

### Botões

```
Primary:
  Background: accent-primary
  Text: text-inverse
  Padding: 8px 16px
  Radius: radius-md
  Hover: accent-hover

Ghost:
  Background: transparent
  Text: text-secondary
  Border: 1px solid border-default
  Hover: bg-elevated, text-primary

Destructive:
  Background: transparent
  Text: danger
  Border: 1px solid danger (20% opacidade)
  Hover: background danger (10% opacidade)

Tamanhos:
  sm: padding 6px 12px, text-sm
  md: padding 8px 16px, text-base  (padrão)
  lg: padding 10px 20px, text-lg
```

### Inputs

```
Background: bg-subtle
Border: 1px solid border-default
Border-radius: radius-md
Padding: space-3 space-4
Text: text-base, text-primary
Placeholder: text-muted

Focus: border-focus, shadow-focus
```

### Badge de status

```
Radius: radius-sm
Padding: 2px 8px
Font: text-xs, font-medium

inbox:     bg #1e2226, text #8a9099
backlog:   bg #1e2226, text #8a9099
next:      bg #1a3d5c, text #3b9eff
doing:     bg #1a3d5c, text #5fb0ff
waiting:   bg #3d2e0f, text #e8a838
done:      bg #1a3d2a, text #4caf7d
archived:  bg #1a1c20, text #4a5260
```

### CheckInOutCard

```
Background: bg-surface
Border-radius: radius-lg
Padding: space-6

Estado check-in ativo: borda esquerda 3px solid success
Contador de tempo: text-2xl, font-bold, text-primary (estilo monoespaçado)
```

### Sidebar

```
Background: bg-surface
Width: 220px (desktop)
Border-right: 1px solid border-subtle
Padding: space-4

Item de menu:
  Padding: space-2 space-3
  Radius: radius-md
  Text: text-sm, text-secondary
  
  Hover: bg-elevated, text-primary
  Ativo: bg-accent-muted, text accent-primary, font-medium

Logo/nome: text-lg, font-semibold, text-primary
```

### MetricCard

```
Background: bg-surface
Border-radius: radius-md
Padding: space-4 space-6

Label: text-xs, text-secondary, uppercase
Valor: text-2xl, font-bold, text-primary
```

---

## 8. Estados de UI

### Vazio (empty state)

```
Ícone: 40px, text-muted
Título: text-base, text-secondary
Subtítulo: text-sm, text-muted
CTA: botão ghost ou link
Centralizado verticalmente
```

### Limite atingido

```
Exibir banner warning no topo da lista/coluna:
Background: #3d2e0f
Text: #e8a838
Border-left: 3px solid #e8a838
Padding: space-3 space-4
Radius: radius-sm
Text: text-sm
```

### Loading

```
Skeleton: bg-elevated com shimmer sutil (opacity 0.4 → 0.7 → 0.4)
Sem spinners giratórios
```

---

## 9. Animações

Mínimas e funcionais. Nada decorativo.

| Interação | Easing | Duração |
|-----------|--------|---------|
| Hover de card | ease-out | 120ms |
| Abertura de modal | ease-out | 180ms |
| Fechamento de modal | ease-in | 140ms |
| Fade in de página | ease-out | 200ms |
| Transição de status | ease-in-out | 150ms |

---

## 10. Tailwind: configuração sugerida

Adicionar ao `tailwind.config.ts`:

```ts
colors: {
  bg: {
    base:     '#0a0c0e',
    surface:  '#111416',
    elevated: '#181b1f',
    subtle:   '#1e2226',
  },
  text: {
    primary:   '#e8eaed',
    secondary: '#8a9099',
    muted:     '#4a5260',
  },
  accent: {
    DEFAULT: '#3b9eff',
    hover:   '#5fb0ff',
    muted:   '#1a3d5c',
  },
  border: {
    DEFAULT: '#1e2226',
    subtle:  '#161a1e',
    focus:   '#3b9eff',
  },
  status: {
    doing:    '#3b9eff',
    done:     '#4caf7d',
    waiting:  '#e8a838',
    archived: '#4a5260',
  },
  danger:  '#e05c5c',
  warning: '#e8a838',
  success: '#4caf7d',
}
```

---

## 11. Referência rápida

| Preciso de... | Use |
|---------------|-----|
| Fundo de tela | `bg-base` (`#0a0c0e`) |
| Fundo de card | `bg-surface` (`#111416`) |
| Texto normal | `text-primary` (`#e8eaed`) |
| Texto de label | `text-secondary` (`#8a9099`) |
| Botão principal | `accent-primary` com texto `text-inverse` |
| Borda padrão | `border-default` (`#1e2226`) |
| Destaque de foco | `border-focus` (`#3b9eff`) com `shadow-focus` |
| Estado de erro | `danger` (`#e05c5c`) |
| Tarefa concluída | `status-done` (`#4caf7d`) |
