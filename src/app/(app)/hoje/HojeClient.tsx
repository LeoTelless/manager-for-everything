"use client";

import { useState, useTransition } from "react";
import { CheckInOutCard } from "@/components/layout/CheckInOutCard";
import { MetricCard } from "@/components/layout/MetricCard";
import { TodayTaskList } from "@/components/tasks/TodayTaskList";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Task, Area, WorkDay, UpdateTaskInput } from "@/types";
import { createClient } from "@/lib/supabase/browser";

interface HojeClientProps {
  initialWorkDay: WorkDay | null;
  initialTasks: Task[];
  initialCompletedToday: Task[];
  areas: Area[];
  todayDate: string;
}

type DayEndState = "idle" | "preview";

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}h${String(min).padStart(2, "0")}min`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HojeClient({
  initialWorkDay,
  initialTasks,
  initialCompletedToday,
  areas,
  todayDate,
}: HojeClientProps) {
  const [workDay, setWorkDay]           = useState<WorkDay | null>(initialWorkDay);
  const [tasks, setTasks]               = useState<Task[]>(initialTasks);
  const [completedToday, setCompleted]  = useState<Task[]>(initialCompletedToday);
  const [summary, setSummary]           = useState(initialWorkDay?.summary ?? "");
  const [editingTask, setEditing]       = useState<Task | null>(null);
  const [dayEndState, setDayEndState]   = useState<DayEndState>("idle");
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [, startTransition]             = useTransition();

  const supabase = createClient();

  // ─── Check-in (T-33) ─────────────────────────────────────────────────────

  async function handleCheckIn() {
    setLoading(true);
    setError(null);
    const now = new Date().toISOString();
    const { data, error: err } = await supabase
      .from("work_days")
      .upsert({ date: todayDate, check_in_at: now }, { onConflict: "date" })
      .select()
      .single();
    setLoading(false);
    if (err || !data) { setError("Não foi possível fazer check-in."); return; }
    setWorkDay(data);
  }

  // ─── Check-out (T-34) ────────────────────────────────────────────────────

  async function handleCheckOut() {
    if (!workDay?.check_in_at) return;
    setLoading(true);
    setError(null);
    const now = new Date().toISOString();
    const totalMinutes = Math.floor(
      (new Date(now).getTime() - new Date(workDay.check_in_at).getTime()) / 60000
    );
    const { data, error: err } = await supabase
      .from("work_days")
      .update({ check_out_at: now, total_minutes: totalMinutes })
      .eq("id", workDay.id)
      .select()
      .single();
    setLoading(false);
    if (err || !data) { setError("Não foi possível fazer check-out."); return; }
    setWorkDay(data);
  }

  // ─── Mark doing (T-36) ───────────────────────────────────────────────────

  async function handleMarkDoing(id: string) {
    const { data, error: err } = await supabase
      .from("tasks").update({ status: "doing" }).eq("id", id).select().single();
    if (err || !data) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  // ─── Mark done (T-36) ────────────────────────────────────────────────────

  async function handleMarkDone(id: string) {
    const now = new Date().toISOString();
    const { data, error: err } = await supabase
      .from("tasks")
      .update({ status: "done", completed_at: now, is_today: false })
      .eq("id", id).select().single();
    if (err || !data) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompleted((prev) => [data, ...prev]);
  }

  // ─── Remove from today (T-36) ────────────────────────────────────────────

  async function handleRemoveFromToday(id: string) {
    const { data, error: err } = await supabase
      .from("tasks").update({ is_today: false }).eq("id", id).select().single();
    if (err || !data) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Save edit ───────────────────────────────────────────────────────────

  async function saveEdit(id: string, updates: UpdateTaskInput) {
    const { data, error: err } = await supabase
      .from("tasks").update(updates).eq("id", id).select().single();
    if (err || !data) { setError("Não foi possível salvar."); return; }
    if (!data.is_today || data.status === "done" || data.status === "archived") {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (data.status === "done") setCompleted((prev) => [data, ...prev]);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    }
    setEditing(null);
  }

  // ─── Save summary (T-37) ─────────────────────────────────────────────────

  async function saveSummary() {
    if (!workDay) return;
    const { data, error: err } = await supabase
      .from("work_days").update({ summary }).eq("id", workDay.id).select().single();
    if (err || !data) { setError("Não foi possível salvar o resumo."); return; }
    setWorkDay(data);
  }

  // ─── Finalizar dia (T-38) ────────────────────────────────────────────────

  async function handleFinishDay() {
    setError(null);
    if (workDay?.check_in_at && !workDay.check_out_at) {
      setError("Você ainda não fez check-out. Faça check-out antes de finalizar o dia.");
      return;
    }
    await saveSummary();
    setDayEndState("preview");
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const dateLabel = new Date(todayDate + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary capitalize">
          {greeting()}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5 capitalize">{dateLabel}</p>
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

      {/* Check-in/out card (T-32, T-33, T-34) */}
      <CheckInOutCard
        workDay={workDay}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={loading}
      />

      {/* Metrics (T-39, T-53) */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Concluídas hoje" value={completedToday.length} />
        <MetricCard
          label="Tempo hoje"
          value={workDay?.total_minutes ? formatMinutes(workDay.total_minutes) : "—"}
          mono
        />
      </div>

      {/* Today tasks (T-35, T-36) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            Tarefas de hoje
          </h2>
          <span className="text-xs text-text-muted">{tasks.length}/3</span>
        </div>
        <TodayTaskList
          tasks={tasks}
          areas={areas}
          onMarkDoing={(id) => startTransition(() => { handleMarkDoing(id); })}
          onMarkDone={(id) => startTransition(() => { handleMarkDone(id); })}
          onRemoveFromToday={(id) => startTransition(() => { handleRemoveFromToday(id); })}
          onEdit={setEditing}
        />
      </div>

      {/* Summary + Finish day (T-37, T-38) */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          Resumo do dia
        </h2>
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onBlur={workDay ? saveSummary : undefined}
          placeholder="Como foi o dia? O que você avançou?"
          rows={4}
          className="resize-none bg-bg-subtle border-border text-text-primary placeholder:text-text-muted focus-visible:ring-border-focus"
        />
        <Button
          onClick={handleFinishDay}
          disabled={!workDay}
          className="self-end bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
        >
          Finalizar dia
        </Button>
      </div>

      {/* Day end preview (T-38) */}
      {dayEndState === "preview" && (
        <div className="rounded-lg border border-success/30 bg-[#0f2a1a] p-5 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-success">Dia finalizado</h2>

          <div className="grid grid-cols-3 gap-4 text-sm">
            {workDay?.check_in_at && (
              <div>
                <p className="text-xs text-text-muted">Entrada</p>
                <p className="font-medium text-text-primary">
                  {new Date(workDay.check_in_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}
            {workDay?.check_out_at && (
              <div>
                <p className="text-xs text-text-muted">Saída</p>
                <p className="font-medium text-text-primary">
                  {new Date(workDay.check_out_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}
            {workDay?.total_minutes != null && (
              <div>
                <p className="text-xs text-text-muted">Total</p>
                <p className="font-mono font-bold text-text-primary">
                  {formatMinutes(workDay.total_minutes)}
                </p>
              </div>
            )}
          </div>

          {completedToday.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-2">Tarefas concluídas</p>
              <ul className="flex flex-col gap-1">
                {completedToday.map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className="mt-0.5 text-success">✓</span>
                    {t.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary && (
            <div>
              <p className="text-xs text-text-muted mb-1">Resumo</p>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setDayEndState("idle")}
            className="self-start border-border text-text-secondary hover:text-text-primary"
          >
            Fechar
          </Button>
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
