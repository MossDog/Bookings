import { Seller } from "@/types/types";
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