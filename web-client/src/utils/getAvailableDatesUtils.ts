// utils/getAvailableDatesUtils.ts
import supabase from './supabase';

export async function getAvailableDates(sellerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .rpc('get_available_dates', { seller_uuid: sellerId });

  if (error || !data) {
    console.error("Error fetching available dates:", error?.message);
    return [];
  }

  return data.map((row: { day: string }) => row.day.split('T')[0]);
}