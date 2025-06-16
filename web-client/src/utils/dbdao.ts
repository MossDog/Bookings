import supabase from './supabase';
import { Service } from '../types/types';

export const fetchServices = async (
  userId: string
): Promise<{ data: Service[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("service")
      .select("id, name, description, price, category, duration, seller_id")
      .eq("seller_id", userId);

    if (error) {
      throw new Error("Failed to fetch services. Please try again later.");
    }

    return { data: data || [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
};