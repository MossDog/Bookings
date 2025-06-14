// utils/getAvailableDatesUtils.ts
import supabase from './supabase';

/**
 * Calls the Supabase RPC to fetch available booking dates
 * for a given seller.
 * Returns ISO date strings: ["2025-06-17", "2025-06-18", ...]
 */
export async function getAvailableDates(sellerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .rpc('get_available_dates', { seller_uuid: sellerId });

  if (error || !data) {
    console.error("Error fetching available dates:", error?.message);
    return [];
  }

  return (data as (string | Date)[]).map((d: string | Date) =>
    typeof d === 'string' ? d : d.toISOString().split('T')[0]
  );
}