"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCard, type TaskAction } from "./TaskCard";
import { TaskQuickCreate } from "./TaskQuickCreate";
import type { Task, Area } from "@/types";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  area?: Area | null;
  limit?: number;
  showQuickCreate?: boolean;
  onQuickCreate?: (title: string) => Promise<void>;
  getActions: (task: Task) => TaskAction[];
  onTaskClick?: (task: Task) => void;
  className?: string;
}

export function KanbanColumn({
  title,
  tasks,
  area,
  limit,
  showQuickCreate,
  onQuickCreate,
  getActions,
  onTaskClick,
  className,
}: KanbanColumnProps) {
  const atLimit = limit != null && tasks.length >= limit;
  const count = tasks.length;

  return (
    <div
      className={cn(
        "flex w-[280px] shrink-0 flex-col gap-3 rounded-lg bg-bg-subtle p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-widest",
            atLimit ? "text-warning" : "text-text-secondary"
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-xs",
            atLimit
              ? "bg-[#3d2e0f] text-warning"
              : "bg-bg-elevated text-text-muted"
          )}
        >
          {limit != null ? `${count}/${limit}` : count}
        </span>
      </div>

      {/* Quick create */}
      {showQuickCreate && onQuickCreate && !atLimit && (
        <TaskQuickCreate
          onSubmit={onQuickCreate}
          placeholder="Adicionar tarefa..."
          className="shrink-0"
        />
      )}

      {/* Limit warning */}
      {atLimit && (
        <p className="rounded border-l-[3px] border-warning bg-[#3d2e0f] px-3 py-2 text-xs text-warning">
          Limite atingido
        </p>
      )}

      {/* Tasks */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            area={area}
            actions={getActions(task)}
            onClick={() => onTaskClick?.(task)}
          />
        ))}
      </div>

      {/* Empty state */}
      {tasks.length === 0 && !showQuickCreate && (
        <p className="py-4 text-center text-xs text-text-muted">Vazio</p>
      )}
      {tasks.length === 0 && showQuickCreate && !atLimit && (
        <p className="py-2 text-center text-xs text-text-muted">
          Nenhuma tarefa
        </p>
      )}
    </div>
  );
}
