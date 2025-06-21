import { Seller, Service } from "../types/types";
import supabase from "./supabase";

export async function getSellers(): Promise<Seller[]> {
  try {
    const { data, error } = await supabase
      .from("seller")
      .select("*")
      .overrideTypes<Seller[], { merge: false }>();

    if (error) {
      console.error("Error fetching all sellers:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    throw error;
  }
}

export async function getAvailableDates(sellerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .rpc('get_available_dates', { seller_uuid: sellerId });

  if (error || !data) {
    console.error("Error fetching available dates:", error?.message);
    return [];
  }

  return data.map((row: { day: string }) => row.day.split('T')[0]);
}

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

export async function fetchAddressBySellerId(sellerId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("seller")
    .select("address")
    .eq("user_id", sellerId)
    .single();

  if (error || !data?.address) {
    console.error("Error fetching address:", error);
    return null;
  }

  return data.address;
}