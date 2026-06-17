import { createClient } from "@/lib/supabase/server";
import { HojeClient } from "./HojeClient";

export default async function HojePage() {
  const supabase = await createClient();

  const todayDate = new Date().toISOString().split("T")[0];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startISO = startOfDay.toISOString();

  const [
    { data: workDay },
    { data: todayTasks },
    { data: completedToday },
    { data: areas },
  ] = await Promise.all([
    supabase
      .from("work_days")
      .select("*")
      .eq("date", todayDate)
      .maybeSingle(),
    supabase
      .from("tasks")
      .select("*")
      .eq("is_today", true)
      .not("status", "in", '("done","archived")')
      .order("created_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .eq("status", "done")
      .gte("completed_at", startISO)
      .order("completed_at", { ascending: false }),
    supabase.from("areas").select("*").order("name"),
  ]);

  return (
    <div className="px-6 py-8 max-w-2xl">
      <HojeClient
        initialWorkDay={workDay ?? null}
        initialTasks={todayTasks ?? []}
        initialCompletedToday={completedToday ?? []}
        areas={areas ?? []}
        todayDate={todayDate}
      />
    </div>
  );
}
