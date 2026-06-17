import { createClient } from "@/lib/supabase/server";
import { PrioridadesClient } from "./PrioridadesClient";

export default async function PrioridadesPage() {
  const supabase = await createClient();

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const dueCutoff = sevenDaysFromNow.toISOString().split("T")[0];

  const [{ data: priorities }, { data: suggestions }, { data: areas }] =
    await Promise.all([
      // Current week priorities
      supabase
        .from("tasks")
        .select("*")
        .eq("is_week_priority", true)
        .not("status", "in", '("done","archived")')
        .order("created_at", { ascending: false }),

      // Suggestions: high priority/urgency OR due soon — not already a priority
      supabase
        .from("tasks")
        .select("*")
        .eq("is_week_priority", false)
        .not("status", "in", '("done","archived","inbox")')
        .or(
          `priority.in.("high","critical"),urgency.in.("high","critical"),due_date.lte.${dueCutoff}`
        )
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(10),

      supabase.from("areas").select("*").order("name"),
    ]);

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Prioridades</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Defina o que realmente importa nesta semana
        </p>
      </div>

      <PrioridadesClient
        initialPriorities={priorities ?? []}
        initialSuggestions={suggestions ?? []}
        areas={areas ?? []}
      />
    </div>
  );
}
