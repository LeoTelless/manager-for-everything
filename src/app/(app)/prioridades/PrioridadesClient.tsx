"use client";

import { useState, useTransition } from "react";
import { X, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { TaskCard, type TaskAction } from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";
import type { Task, Area, UpdateTaskInput } from "@/types";
import { createClient } from "@/lib/supabase/browser";
import { loadSettings } from "@/lib/settings";

interface PrioridadesClientProps {
  initialPriorities: Task[];
  initialSuggestions: Task[];
  areas: Area[];
}

export function PrioridadesClient({
  initialPriorities,
  initialSuggestions,
  areas,
}: PrioridadesClientProps) {
  const [priorities, setPriorities]   = useState<Task[]>(initialPriorities);
  const [suggestions, setSuggestions] = useState<Task[]>(initialSuggestions);
  const [editingTask, setEditing]     = useState<Task | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [, startTransition]           = useTransition();

  const supabase  = createClient();
  const areaMap   = Object.fromEntries(areas.map((a) => [a.id, a]));
  const count     = priorities.length;
  const max       = loadSettings().limits.weekPriorities;
  const atLimit   = count >= max;

  // ─── Add from suggestions (T-42, T-43) ─────────────────────────────────

  async function addPriority(task: Task) {
    setError(null);
    if (atLimit) {
      setError(`Você já tem ${max} prioridades semanais. Remova uma antes de adicionar outra.`);
      return;
    }
    const { data, error: err } = await supabase
      .from("tasks").update({ is_week_priority: true }).eq("id", task.id).select().single();
    if (err || !data) { setError("Não foi possível adicionar a prioridade."); return; }
    setPriorities((prev) => [...prev, data]);
    setSuggestions((prev) => prev.filter((t) => t.id !== task.id));
  }

  // ─── Remove priority (T-44) ─────────────────────────────────────────────

  async function removePriority(id: string) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks").update({ is_week_priority: false }).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível remover a prioridade."); return; }
    setPriorities((prev) => prev.filter((t) => t.id !== id));
    // Add back to suggestions if it qualifies
    if (data.status !== "done" && data.status !== "archived") {
      setSuggestions((prev) => [data, ...prev]);
    }
  }

  // ─── Save edit ──────────────────────────────────────────────────────────

  async function saveEdit(id: string, updates: UpdateTaskInput) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks").update(updates).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível salvar."); return; }
    // Update whichever list contains this task
    setPriorities((prev) => prev.map((t) => (t.id === id ? data : t)));
    setSuggestions((prev) => prev.map((t) => (t.id === id ? data : t)));
    setEditing(null);
  }

  // ─── Priority card actions ──────────────────────────────────────────────

  function getPriorityActions(task: Task): TaskAction[] {
    return [
      { label: "Editar",             onClick: () => setEditing(task) },
      { label: "Remover da semana",  onClick: () => startTransition(() => { removePriority(task.id); }) },
    ];
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Error */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border-l-[3px] border-warning bg-[#3d2e0f] px-4 py-2.5 text-sm text-warning">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-xs underline opacity-70 hover:opacity-100">
            Fechar
          </button>
        </div>
      )}

      {/* Header — indicator (T-41) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-4 w-4 text-accent-brand" />
          <h2 className="text-sm font-medium text-text-primary">Prioridades da semana</h2>
        </div>
        <span
          className={cn(
            "rounded px-2 py-0.5 text-xs font-medium tabular-nums",
            atLimit
              ? "bg-[#3d2e0f] text-warning"
              : "bg-bg-elevated text-text-muted"
          )}
        >
          {count}/{max}
        </span>
      </div>

      {/* Priority list (T-40) */}
      <div className="flex flex-col gap-2">
        {priorities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-10 text-center">
            <Star className="h-6 w-6 text-text-muted mb-2" />
            <p className="text-sm text-text-secondary">Nenhuma prioridade definida</p>
            <p className="text-xs text-text-muted mt-1">
              Escolha até {max} tarefas nas sugestões abaixo
            </p>
          </div>
        ) : (
          priorities.map((task) => (
            <div key={task.id} className="group flex items-start gap-2">
              <TaskCard
                task={task}
                area={task.area_id ? areaMap[task.area_id] : null}
                actions={getPriorityActions(task)}
                onClick={() => setEditing(task)}
                className="flex-1"
              />
              <button
                onClick={() => startTransition(() => { removePriority(task.id); })}
                className="mt-2 shrink-0 rounded p-1 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-bg-subtle hover:text-text-primary"
                title="Remover da semana"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Suggestions (T-45) */}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              Sugestões
            </h2>
            <span className="text-xs text-text-muted">
              tarefas com alta prioridade, urgência ou prazo próximo
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {suggestions.map((task) => (
              <div key={task.id} className="group flex items-start gap-2">
                <TaskCard
                  task={task}
                  area={task.area_id ? areaMap[task.area_id] : null}
                  actions={[{ label: "Editar", onClick: () => setEditing(task) }]}
                  onClick={() => setEditing(task)}
                  className="flex-1"
                />
                <button
                  onClick={() => startTransition(() => { addPriority(task); })}
                  disabled={atLimit}
                  className={cn(
                    "mt-2 shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100",
                    atLimit
                      ? "cursor-not-allowed text-text-muted"
                      : "text-accent-brand hover:bg-accent-brand-muted"
                  )}
                  title={atLimit ? "Limite atingido" : "Adicionar às prioridades"}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <TaskEditDialog
        task={editingTask}
        areas={areas}
        open={editingTask !== null}
        onClose={() => setEditing(null)}
        onSave={saveEdit}
      />
    </div>
  );
}
