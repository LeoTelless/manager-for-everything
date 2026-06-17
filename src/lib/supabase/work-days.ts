import { supabase } from "./client";
import type { WorkDay } from "@/types";

export async function getWorkDay(date: string): Promise<WorkDay | null> {
  const { data, error } = await supabase
    .from("work_days")
    .select("*")
    .eq("date", date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTodayWorkDay(): Promise<WorkDay | null> {
  const today = new Date().toISOString().split("T")[0];
  return getWorkDay(today);
}

export async function getWorkDays(limit = 30): Promise<WorkDay[]> {
  const { data, error } = await supabase
    .from("work_days")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getWorkDaysInRange(
  from: string,
  to: string
): Promise<WorkDay[]> {
  const { data, error } = await supabase
    .from("work_days")
    .select("*")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkIn(): Promise<WorkDay> {
  const today = new Date().toISOString().split("T")[0];
  const now   = new Date().toISOString();

  const { data, error } = await supabase
    .from("work_days")
    .upsert({ date: today, check_in_at: now }, { onConflict: "date" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkOut(workDayId: string): Promise<WorkDay> {
  const now = new Date().toISOString();

  // Busca o registro para calcular o total
  const { data: existing, error: fetchError } = await supabase
    .from("work_days")
    .select("check_in_at")
    .eq("id", workDayId)
    .single();

  if (fetchError) throw fetchError;

  const totalMinutes = existing.check_in_at
    ? Math.floor(
        (new Date(now).getTime() - new Date(existing.check_in_at).getTime()) /
          60000
      )
    : 0;

  const { data, error } = await supabase
    .from("work_days")
    .update({ check_out_at: now, total_minutes: totalMinutes })
    .eq("id", workDayId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveSummary(
  workDayId: string,
  summary: string
): Promise<WorkDay> {
  const { data, error } = await supabase
    .from("work_days")
    .update({ summary })
    .eq("id", workDayId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWeekTotalMinutes(): Promise<number> {
  const now  = new Date();
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const from = monday.toISOString().split("T")[0];
  const to   = sunday.toISOString().split("T")[0];

  const days = await getWorkDaysInRange(from, to);
  return days.reduce((sum, d) => sum + (d.total_minutes ?? 0), 0);
}
