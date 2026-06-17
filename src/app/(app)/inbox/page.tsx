import { createClient } from "@/lib/supabase/server";
import { InboxClient } from "./InboxClient";

export default async function InboxPage() {
  const supabase = await createClient();

  const [{ data: tasks }, { data: areas }, { count: todayCount }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("status", "inbox")
      .order("created_at", { ascending: false }),
    supabase
      .from("areas")
      .select("*")
      .order("name"),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("is_today", true)
      .not("status", "in", '("done","archived")'),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Inbox</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Capture e triagie suas tarefas
        </p>
      </div>

      <InboxClient
        initialTasks={tasks ?? []}
        areas={areas ?? []}
        initialTodayCount={todayCount ?? 0}
      />
    </div>
  );
}
