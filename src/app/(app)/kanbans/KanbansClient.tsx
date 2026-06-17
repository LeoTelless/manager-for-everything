"use client";

import { useState, useTransition } from "react";
import { KanbanColumn } from "@/components/tasks/KanbanColumn";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { type TaskAction } from "@/components/tasks/TaskCard";
import type { Task, Area, TaskStatus, UpdateTaskInput } from "@/types";
import { createClient } from "@/lib/supabase/browser";
import { loadSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

interface KanbansClientProps {
  initialTasks: Task[];
  areas: Area[];
  initialTodayCount: number;
  initialWeekCount: number;
}

type ColumnDef = {
  status: TaskStatus;
  title: string;
  limit?: number;
  showCreate?: boolean;
};

function makeColumns(nextPerArea: number, doingPerArea: number): ColumnDef[] {
  return [
    { status: "backlog",  title: "Backlog",    showCreate: true },
    { status: "next",     title: "Próximo",    limit: nextPerArea,  showCreate: true },
    { status: "doing",    title: "Fazendo",    limit: doingPerArea, showCreate: true },
    { status: "waiting",  title: "Aguardando", showCreate: false },
    { status: "done",     title: "Concluído",  showCreate: false },
  ];
}

export function KanbansClient({
  initialTasks,
  areas,
  initialTodayCount,
  initialWeekCount,
}: KanbansClientProps) {
  const [tasks, setTasks]           = useState<Task[]>(initialTasks);
  const [selectedAreaId, setAreaId] = useState<string>(areas[0]?.id ?? "");
  const [editingTask, setEditing]   = useState<Task | null>(null);
  const [todayCount, setTodayCount] = useState(initialTodayCount);
  const [weekCount, setWeekCount]   = useState(initialWeekCount);
  const [error, setError]           = useState<string | null>(null);
  const [, startTransition]         = useTransition();

  const limits = loadSettings().limits;
  const supabase = createClient();
  const selectedArea = areas.find((a) => a.id === selectedAreaId) ?? null;

  // Tasks for selected area, grouped by status
  const areaTasksAll = tasks.filter((t) => t.area_id === selectedAreaId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  function tasksFor(status: TaskStatus) {
    const filtered = areaTasksAll.filter((t) => t.status === status);
    if (status === "done") {
      return filtered.filter(
        (t) => t.completed_at && new Date(t.completed_at) >= thirtyDaysAgo
      );
    }
    return filtered;
  }

  // ─── Create task ─────────────────────────────────────────────────────────

  async function handleCreate(title: string, status: TaskStatus) {
    setError(null);

    // Validate limits before creating
    if (status === "next") {
      const nextCount = tasksFor("next").length;
      if (nextCount >= limits.nextPerArea) {
        setError(`Esta área já tem ${limits.nextPerArea} tarefas em Próximo. Mova ou arquive uma antes de adicionar outra.`);
        return;
      }
    }
    if (status === "doing") {
      const doingCount = tasksFor("doing").length;
      if (doingCount >= limits.doingPerArea) {
        setError(`Você já tem ${limits.doingPerArea} tarefas em andamento nesta área. Conclua, mova ou pause uma delas antes de iniciar outra.`);
        return;
      }
    }

    const { data, error: err } = await supabase
      .from("tasks")
      .insert({ title, status, area_id: selectedAreaId })
      .select()
      .single();

    if (err || !data) { setError("Não foi possível criar a tarefa."); return; }
    setTasks((prev) => [data, ...prev]);
  }

  // ─── Move task ───────────────────────────────────────────────────────────

  async function moveTask(id: string, newStatus: TaskStatus) {
    setError(null);

    // Validate limits
    if (newStatus === "next") {
      const nextCount = tasksFor("next").length;
      if (nextCount >= limits.nextPerArea) {
        setError(`Esta área já tem ${limits.nextPerArea} tarefas em Próximo. Mova ou arquive uma antes de adicionar outra.`);
        return;
      }
    }
    if (newStatus === "doing") {
      const doingCount = tasksFor("doing").length;
      if (doingCount >= limits.doingPerArea) {
        setError(`Você já tem ${limits.doingPerArea} tarefas em andamento nesta área. Conclua, mova ou pause uma delas antes de iniciar outra.`);
        return;
      }
    }

    const update =
      newStatus === "done"
        ? { status: newStatus, completed_at: new Date().toISOString(), is_today: false }
        : { status: newStatus };

    const { data, error: err } = await supabase
      .from("tasks")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (err || !data) { setError("Não foi possível mover a tarefa."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  // ─── Mark today ──────────────────────────────────────────────────────────

  async function markAsToday(id: string) {
    setError(null);
    if (todayCount >= limits.today) {
      setError(`Você já tem ${limits.today} tarefas para hoje. Para adicionar outra, remova uma tarefa atual.`);
      return;
    }
    const { data, error: err } = await supabase
      .from("tasks").update({ is_today: true }).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível marcar como hoje."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    setTodayCount((c) => c + 1);
  }

  // ─── Mark week priority ──────────────────────────────────────────────────

  async function markAsWeekPriority(id: string) {
    setError(null);
    if (weekCount >= limits.weekPriorities) {
      setError(`Você já definiu ${limits.weekPriorities} prioridades para esta semana. Para adicionar outra, remova uma prioridade atual.`);
      return;
    }
    const { data, error: err } = await supabase
      .from("tasks").update({ is_week_priority: true }).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível marcar como prioridade."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    setWeekCount((c) => c + 1);
  }

  // ─── Archive ─────────────────────────────────────────────────────────────

  async function archiveTask(id: string) {
    setError(null);
    const { error: err } = await supabase
      .from("tasks")
      .update({ status: "archived", archived_at: new Date().toISOString(), is_today: false, is_week_priority: false })
      .eq("id", id);
    if (err) { setError("Não foi possível arquivar."); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Delete ──────────────────────────────────────────────────────────────

  async function deleteTask(id: string) {
    setError(null);
    const { error: err } = await supabase.from("tasks").delete().eq("id", id);
    if (err) { setError("Não foi possível excluir."); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Save edit ───────────────────────────────────────────────────────────

  async function saveEdit(id: string, updates: UpdateTaskInput) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks").update(updates).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível salvar."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    setEditing(null);
  }

  // ─── Actions per card ────────────────────────────────────────────────────

  function getActions(task: Task): TaskAction[] {
    const actions: TaskAction[] = [];

    if (task.status !== "next")     actions.push({ label: "Mover para Próximo",    onClick: () => startTransition(() => { moveTask(task.id, "next"); }) });
    if (task.status !== "doing")    actions.push({ label: "Mover para Fazendo",    onClick: () => startTransition(() => { moveTask(task.id, "doing"); }) });
    if (task.status !== "waiting")  actions.push({ label: "Mover para Aguardando", onClick: () => startTransition(() => { moveTask(task.id, "waiting"); }) });
    if (task.status !== "backlog")  actions.push({ label: "Mover para Backlog",    onClick: () => startTransition(() => { moveTask(task.id, "backlog"); }) });
    if (task.status !== "done")     actions.push({ label: "Concluir",              onClick: () => startTransition(() => { moveTask(task.id, "done"); }) });

    if (!task.is_today)             actions.push({ label: "Marcar como Hoje",      onClick: () => startTransition(() => { markAsToday(task.id); }) });
    if (!task.is_week_priority)     actions.push({ label: "Prioridade da Semana",  onClick: () => startTransition(() => { markAsWeekPriority(task.id); }) });

    actions.push({ label: "Editar",   onClick: () => setEditing(task) });
    actions.push({ label: "Arquivar", onClick: () => startTransition(() => { archiveTask(task.id); }) });
    actions.push({ label: "Excluir",  variant: "danger", onClick: () => startTransition(() => { deleteTask(task.id); }) });

    return actions;
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Area selector */}
      <div className="flex gap-2 flex-wrap">
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => setAreaId(area.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors duration-100",
              selectedAreaId === area.id
                ? "bg-accent-brand-muted text-accent-brand font-medium"
                : "bg-bg-surface text-text-secondary border border-border hover:bg-bg-elevated hover:text-text-primary"
            )}
          >
            {area.name}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border-l-[3px] border-warning bg-[#3d2e0f] px-4 py-2.5 text-sm text-warning">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-xs underline opacity-70 hover:opacity-100">
            Fechar
          </button>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {makeColumns(limits.nextPerArea, limits.doingPerArea).map(({ status, title, limit, showCreate }) => (
          <KanbanColumn
            key={status}
            title={title}
            tasks={tasksFor(status)}
            area={selectedArea}
            limit={limit}
            showQuickCreate={showCreate}
            onQuickCreate={showCreate ? (t) => handleCreate(t, status) : undefined}
            getActions={getActions}
            onTaskClick={setEditing}
          />
        ))}
      </div>

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
