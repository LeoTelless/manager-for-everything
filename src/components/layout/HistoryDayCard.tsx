"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkDay, Task } from "@/types";

interface HistoryDayCardProps {
  workDay: WorkDay;
  completedTasks: Task[];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}min`;
}

function formatDate(dateStr: string) {
  // dateStr is YYYY-MM-DD; parse as local date to avoid timezone shifts
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HistoryDayCard({ workDay, completedTasks }: HistoryDayCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasTime = workDay.check_in_at && workDay.check_out_at;

  return (
    <div className="rounded-lg border border-border bg-bg-surface">
      {/* Header — always visible */}
      <button
        className="flex w-full items-start justify-between px-5 py-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium capitalize text-text-primary">
            {formatDate(workDay.date)}
          </span>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            {workDay.check_in_at && (
              <span>Entrada: <span className="text-text-primary">{formatTime(workDay.check_in_at)}</span></span>
            )}
            {workDay.check_out_at && (
              <span>Saída: <span className="text-text-primary">{formatTime(workDay.check_out_at)}</span></span>
            )}
            {workDay.total_minutes > 0 && (
              <span className="font-mono font-bold text-text-primary">
                {formatMinutes(workDay.total_minutes)}
              </span>
            )}
            <span className="text-text-muted">
              {completedTasks.length} {completedTasks.length === 1 ? "tarefa" : "tarefas"}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4">
          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Tarefas concluídas
              </p>
              <ul className="flex flex-col gap-1.5">
                {completedTasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className="mt-0.5 text-success">✓</span>
                    <span>{t.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          {workDay.summary && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Resumo
              </p>
              <p className="whitespace-pre-wrap text-sm text-text-primary leading-relaxed">
                {workDay.summary}
              </p>
            </div>
          )}

          {completedTasks.length === 0 && !workDay.summary && (
            <p className="text-xs text-text-muted">Nenhum dado registrado para este dia.</p>
          )}
        </div>
      )}
    </div>
  );
}
