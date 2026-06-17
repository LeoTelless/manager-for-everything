"use client";

import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Area, TaskStatus, TaskPriority, TaskSize } from "@/types";

// ─── Badge helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<TaskStatus, string> = {
  inbox:    "Inbox",
  backlog:  "Backlog",
  next:     "Próximo",
  doing:    "Fazendo",
  waiting:  "Aguardando",
  done:     "Concluído",
  archived: "Arquivado",
};

const STATUS_CLASS: Record<TaskStatus, string> = {
  inbox:    "bg-bg-subtle text-text-secondary",
  backlog:  "bg-bg-subtle text-text-secondary",
  next:     "bg-accent-brand-muted text-accent-brand",
  doing:    "bg-accent-brand-muted text-accent-brand-hover",
  waiting:  "bg-[#3d2e0f] text-warning",
  done:     "bg-[#1a3d2a] text-success",
  archived: "bg-[#1a1c20] text-text-muted",
};

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  high:   "bg-[#3d1a1a] text-danger",
  medium: "bg-[#3d2e0f] text-warning",
  low:    "bg-bg-subtle text-text-muted",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high:   "Alta",
  medium: "Média",
  low:    "Baixa",
};

const SIZE_CLASS: Record<TaskSize, string> = {
  small:  "bg-bg-subtle text-text-muted",
  medium: "bg-bg-subtle text-text-secondary",
  large:  "bg-bg-subtle text-text-secondary",
};

const SIZE_LABEL: Record<TaskSize, string> = {
  small:  "P",
  medium: "M",
  large:  "G",
};

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

// ─── Action menu item ─────────────────────────────────────────────────────────

export interface TaskAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  area?: Area | null;
  actions?: TaskAction[];
  onClick?: () => void;
  className?: string;
}

export function TaskCard({ task, area, actions, onClick, className }: TaskCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-md border border-border bg-bg-surface px-4 py-3",
        "transition-colors duration-100",
        "hover:bg-bg-elevated hover:border-border-focus/30",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Actions menu */}
      {actions && actions.length > 0 && (
        <ActionMenu actions={actions} />
      )}

      {/* Title */}
      <p className={cn(
        "text-sm text-text-primary pr-6 leading-snug",
        task.status === "done" && "line-through text-text-muted"
      )}>
        {task.title}
      </p>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {area && (
          <span className="text-xs text-text-muted">{area.name}</span>
        )}
        {area && (
          <span className="text-xs text-text-muted">·</span>
        )}
        <Badge className={STATUS_CLASS[task.status]}>
          {STATUS_LABEL[task.status]}
        </Badge>
        {task.priority !== "medium" && (
          <Badge className={PRIORITY_CLASS[task.priority]}>
            {PRIORITY_LABEL[task.priority]}
          </Badge>
        )}
        <Badge className={SIZE_CLASS[task.size]}>
          {SIZE_LABEL[task.size]}
        </Badge>
        {task.due_date && (
          <span className="text-xs text-text-muted">
            {new Date(task.due_date + "T00:00:00").toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
        {task.is_today && (
          <Badge className="bg-accent-brand-muted text-accent-brand">Hoje</Badge>
        )}
        {task.is_week_priority && (
          <Badge className="bg-[#2a1f3d] text-[#a78bfa]">Semana</Badge>
        )}
      </div>
    </div>
  );
}

// ─── ActionMenu ───────────────────────────────────────────────────────────────

function ActionMenu({ actions }: { actions: TaskAction[] }) {
  return (
    <div className="absolute right-2 top-2.5">
      <div className="relative group/menu">
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded",
            "text-text-muted opacity-0 group-hover:opacity-100",
            "hover:bg-bg-subtle hover:text-text-primary",
            "transition-opacity duration-100",
            "peer"
          )}
          aria-label="Ações da tarefa"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {/* Dropdown */}
        <div
          role="menu"
          aria-label="Ações disponíveis"
          className={cn(
            "absolute right-0 top-7 z-50 min-w-40 rounded-md border border-border",
            "bg-bg-elevated shadow-md py-1",
            "invisible opacity-0 peer-focus:visible peer-focus:opacity-100",
            "group-focus-within/menu:visible group-focus-within/menu:opacity-100",
            "transition-opacity duration-100"
          )}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm",
                "transition-colors duration-75",
                "focus:outline-none focus:ring-1 focus:ring-inset focus:ring-border-focus",
                action.variant === "danger"
                  ? "text-danger hover:bg-[#3d1a1a]"
                  : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
