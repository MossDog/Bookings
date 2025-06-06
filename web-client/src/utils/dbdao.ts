import supabase from './supabase';
import { Service } from '../types/types'; 

export const fetchServices = async (): Promise<{ data: Service[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("Service")
      .select("id, name, description, price") as { data: Service[]; error: Error | null };

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