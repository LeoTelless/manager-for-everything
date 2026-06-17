import { createClient } from "@/lib/supabase/server";
import { KanbansClient } from "./KanbansClient";

export default async function KanbansPage() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString();

  const [{ data: tasks }, { data: areas }, { count: todayCount }, { count: weekCount }] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .not("status", "eq", "archived")
        .not("status", "eq", "inbox")
        .or(`status.neq.done,completed_at.gte.${cutoff}`)
        .order("created_at", { ascending: false }),
      supabase.from("areas").select("*").order("name"),
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("is_today", true)
        .not("status", "in", '("done","archived")'),
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("is_week_priority", true)
        .not("status", "in", '("done","archived")'),
    ]);

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Kanbans</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Organize suas tarefas por área
        </p>
      </div>

      <KanbansClient
        initialTasks={tasks ?? []}
        areas={areas ?? []}
        initialTodayCount={todayCount ?? 0}
        initialWeekCount={weekCount ?? 0}
      />
    </div>
  );
}
