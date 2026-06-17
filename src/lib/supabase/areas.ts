import { supabase } from "./client";
import type { Area } from "@/types";

export async function getAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}
