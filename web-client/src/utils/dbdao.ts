import supabase from "./supabase";

export async function fetchTable<T = unknown>(
  table: string,
  match: Record<string, unknown>,
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*").match(match);
  if (error) throw new Error(error.message);
  return data as T[];
}
