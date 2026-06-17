"use client";

import { useState, useTransition } from "react";
import { TaskQuickCreate } from "@/components/tasks/TaskQuickCreate";
import { TaskCard, type TaskAction } from "@/components/tasks/TaskCard";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import type { Task, Area, UpdateTaskInput } from "@/types";
import { createClient } from "@/lib/supabase/browser";
import { loadSettings } from "@/lib/settings";

interface InboxClientProps {
  initialTasks: Task[];
  areas: Area[];
  initialTodayCount: number;
}

export function InboxClient({ initialTasks, areas, initialTodayCount }: InboxClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [todayCount, setTodayCount] = useState(initialTodayCount);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [, startTransition] = useTransition();

  const limits = loadSettings().limits;
  const supabase = createClient();
  const areaMap = Object.fromEntries(areas.map((a) => [a.id, a]));

  // ─── Criar tarefa ─────────────────────────────────────────────────────────

  async function handleCreate(title: string) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks")
      .insert({ title, status: "inbox" })
      .select()
      .single();

    if (err || !data) { setError("Não foi possível criar a tarefa."); return; }
    setTasks((prev) => [data, ...prev]);
  }

  // ─── Mover status ─────────────────────────────────────────────────────────

  async function moveTask(id: string, status: Task["status"]) {
    setError(null);
    const update =
      status === "done"
        ? { status, completed_at: new Date().toISOString(), is_today: false }
        : { status };

    const { data, error: err } = await supabase
      .from("tasks")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (err || !data) { setError("Não foi possível mover a tarefa."); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Definir área ─────────────────────────────────────────────────────────

  async function setArea(id: string, area_id: string) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks")
      .update({ area_id })
      .eq("id", id)
      .select()
      .single();

    if (err || !data) { setError("Não foi possível definir a área."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  // ─── Marcar como hoje ────────────────────────────────────────────────────

  async function markAsToday(id: string) {
    setError(null);
    if (todayCount >= limits.today) {
      setError(
        `Você já tem ${limits.today} tarefas para hoje. Remova uma antes de adicionar outra.`
      );
      return;
    }

    const { data, error: err } = await supabase
      .from("tasks")
      .update({ is_today: true })
      .eq("id", id)
      .select()
      .single();

    if (err || !data) { setError("Não foi possível marcar como hoje."); return; }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    setTodayCount((c) => c + 1);
  }

  // ─── Arquivar ─────────────────────────────────────────────────────────────

  async function archiveTask(id: string) {
    setError(null);
    const { error: err } = await supabase
      .from("tasks")
      .update({ status: "archived", archived_at: new Date().toISOString(), is_today: false, is_week_priority: false })
      .eq("id", id);

    if (err) { setError("Não foi possível arquivar a tarefa."); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Excluir ──────────────────────────────────────────────────────────────

  async function deleteTask(id: string) {
    setError(null);
    const { error: err } = await supabase.from("tasks").delete().eq("id", id);
    if (err) { setError("Não foi possível excluir a tarefa."); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Salvar edição ────────────────────────────────────────────────────────

  async function saveEdit(id: string, updates: UpdateTaskInput) {
    setError(null);
    const { data, error: err } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (err || !data) { setError("Não foi possível salvar a tarefa."); return; }

    // Se status mudou de inbox, remover da lista
    if (data.status !== "inbox") {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    }
    setEditingTask(null);
  }

  // ─── Ações por card ───────────────────────────────────────────────────────

  function getActions(task: Task): TaskAction[] {
    const actions: TaskAction[] = [];

    // Definir área (subações inline não suportadas no menu simples — mostra opções de área)
    areas.forEach((area) => {
      if (task.area_id !== area.id) {
        actions.push({
          label: `Mover para ${area.name}`,
          onClick: () => startTransition(() => { setArea(task.id, area.id); }),
        });
      }
    });

    actions.push({
      label: "Mover para Backlog",
      onClick: () => startTransition(() => { moveTask(task.id, "backlog"); }),
    });

    actions.push({
      label: "Mover para Próximo",
      onClick: () => startTransition(() => { moveTask(task.id, "next"); }),
    });

    actions.push({
      label: "Marcar como Hoje",
      onClick: () => startTransition(() => { markAsToday(task.id); }),
    });

    actions.push({
      label: "Editar",
      onClick: () => setEditingTask(task),
    });

    actions.push({
      label: "Arquivar",
      onClick: () => startTransition(() => { archiveTask(task.id); }),
    });

    actions.push({
      label: "Excluir",
      variant: "danger",
      onClick: () => startTransition(() => { deleteTask(task.id); }),
    });

    return actions;
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* Quick create */}
      <TaskQuickCreate onSubmit={handleCreate} placeholder="Adicionar tarefa na inbox..." />

      {/* Error */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border-l-[3px] border-warning bg-[#3d2e0f] px-4 py-2.5 text-sm text-warning">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-xs underline opacity-70 hover:opacity-100"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-text-secondary">Inbox vazia</p>
          <p className="text-xs text-text-muted mt-1">
            Adicione tarefas acima para começar a organizar
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              area={task.area_id ? areaMap[task.area_id] : null}
              actions={getActions(task)}
            />
          ))}
        </div>
      )}

      {/* Count */}
      {tasks.length > 0 && (
        <p className="text-xs text-text-muted text-right">
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </p>
      )}

      {/* Edit dialog */}
      <TaskEditDialog
        task={editingTask}
        areas={areas}
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSave={saveEdit}
      />
    </div>
  );
}
