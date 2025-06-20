import supabase from "./supabase";
import { Service } from "../types/types";

export const fetchServices = async (
  userId: string,
): Promise<{ data: Service[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("service")
      .select("id, name, description, price, category, duration, user_id")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to fetch services. Please try again later.");
    }

    return { data: data || [], error: null };
  } catch (err) {
    return {
      data: [],
      error:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
};

/**
 * Fetch rows from Supabase with a match filter
 */
export async function fetchTable<T = unknown>(
  table: string,
  match: Record<string, unknown>,
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*").match(match);
  if (error) throw new Error(error.message);
  return data as T[];
}
