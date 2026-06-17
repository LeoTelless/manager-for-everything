import { supabase } from "./client";
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "@/types";

export async function getTasks(filters?: {
  status?: TaskStatus;
  area_id?: string;
  is_today?: boolean;
  is_week_priority?: boolean;
}): Promise<Task[]> {
  let query = supabase.from("tasks").select("*");

  if (filters?.status)           query = query.eq("status", filters.status);
  if (filters?.area_id)          query = query.eq("area_id", filters.area_id);
  if (filters?.is_today != null) query = query.eq("is_today", filters.is_today);
  if (filters?.is_week_priority != null)
    query = query.eq("is_week_priority", filters.is_week_priority);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  return getTasks({ status });
}

export async function getTasksByArea(area_id: string): Promise<Task[]> {
  return getTasks({ area_id });
}

export async function getTodayTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_today", true)
    .not("status", "in", '("done","archived")')
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getWeekPriorityTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_week_priority", true)
    .not("status", "in", '("done","archived")')
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTasksCompletedOn(date: string): Promise<Task[]> {
  const start = `${date}T00:00:00.000Z`;
  const end   = `${date}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .gte("completed_at", start)
    .lte("completed_at", end)
    .order("completed_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeTask(id: string): Promise<Task> {
  return updateTask(id, {
    status: "done",
    completed_at: new Date().toISOString(),
    is_today: false,
  });
}

export async function archiveTask(id: string): Promise<Task> {
  return updateTask(id, {
    status: "archived",
    archived_at: new Date().toISOString(),
    is_today: false,
    is_week_priority: false,
  });
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function countTasksByStatus(
  status: TaskStatus,
  area_id?: string
): Promise<number> {
  let query = supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("status", status);

  if (area_id) query = query.eq("area_id", area_id);

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function countTodayTasks(): Promise<number> {
  const { count, error } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("is_today", true)
    .not("status", "in", '("done","archived")');

  if (error) throw error;
  return count ?? 0;
}

export async function countWeekPriorityTasks(): Promise<number> {
  const { count, error } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("is_week_priority", true)
    .not("status", "in", '("done","archived")');

  if (error) throw error;
  return count ?? 0;
}
