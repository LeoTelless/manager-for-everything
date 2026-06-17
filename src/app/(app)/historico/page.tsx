import { createClient } from "@/lib/supabase/server";
import { HistoricoClient } from "./HistoricoClient";
import type { Task } from "@/types";

export default async function HistoricoPage() {
  const supabase = await createClient();

  // Start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon…
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  const mondayISO = monday.toISOString().split("T")[0];

  // Fetch work_days (T-47) — exclude today so Hoje owns the current day
  const today = now.toISOString().split("T")[0];

  const [{ data: workDays }, { data: completedTasks }] = await Promise.all([
    supabase
      .from("work_days")
      .select("*")
      .lt("date", today)
      .order("date", { ascending: false })
      .limit(60),
    // All completed tasks — we'll bucket them per day client-side (T-48)
    supabase
      .from("tasks")
      .select("id, title, completed_at, area_id")
      .eq("status", "done")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false }),
  ]);

  // Group tasks by date string (T-48)
  const tasksByDate: Record<string, Task[]> = {};
  for (const task of completedTasks ?? []) {
    if (!task.completed_at) continue;
    const date = task.completed_at.split("T")[0];
    if (!tasksByDate[date]) tasksByDate[date] = [];
    tasksByDate[date].push(task as Task);
  }

  const days = (workDays ?? []).map((wd) => ({
    workDay: wd,
    completedTasks: tasksByDate[wd.date] ?? [],
  }));

  // Week metrics (T-49)
  const weekDays = (workDays ?? []).filter((wd) => wd.date >= mondayISO);
  const weekMinutes = weekDays.reduce((acc, wd) => acc + (wd.total_minutes ?? 0), 0);
  const weekCompleted = weekDays.reduce(
    (acc, wd) => acc + (tasksByDate[wd.date]?.length ?? 0),
    0
  );

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Histórico</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Registro dos seus dias de trabalho
        </p>
      </div>

      <HistoricoClient
        days={days}
        weekMinutes={weekMinutes}
        weekCompleted={weekCompleted}
      />
    </div>
  );
}
