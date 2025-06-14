import { format } from 'date-fns';
import supabase from './supabase';
import type { WorkingHours, Break, Holiday } from '../types/types';

/**
 * Helper: get every 15-min time slot between two time strings
 */
function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const start = new Date(startTime);
  const end = new Date(endTime);

  while (start < end) {
    slots.push(format(new Date(start), 'HH:mm'));
    start.setMinutes(start.getMinutes() + 15);
  }

  return slots;
}

/**
 * Helper: fetch rows from Supabase with match
 */
async function fetchTable<T = any>(table: string, match: Record<string, any>): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').match(match);
  if (error) throw new Error(error.message);
  return data as T[];
}

/**
 * Main function: get available slots for a given seller and date
 */
export async function getAvailableSlots(sellerId: string, date: Date): Promise<string[]> {
  const isoDate = format(date, 'yyyy-MM-dd');
  const weekday = date.getDay();

  // 1. Get working hours for the seller on this day
  const workingHours = await fetchTable<WorkingHours>('seller_working_hours', {
    user_id: sellerId,
    day_of_week: weekday,
  });

  if (!workingHours.length) return [];

  const workStart = `${isoDate}T${workingHours[0].start_time}`;
  const workEnd = `${isoDate}T${workingHours[0].end_time}`;
  const allSlots = generateTimeSlots(workStart, workEnd);

  // 2. Check for holidays
  const holidays = await fetchTable<Holiday>('seller_holidays', { user_id: sellerId });
  const isHoliday = holidays.some(h => format(new Date(h.date), 'yyyy-MM-dd') === isoDate);
  if (isHoliday) return [];

  // 3. Remove break times
  const breaks = await fetchTable<Break>('seller_breaks', {
    user_id: sellerId,
    day_of_week: weekday,
  });
  const breakSlots = breaks.flatMap(b =>
    generateTimeSlots(`${isoDate}T${b.start_time}`, `${isoDate}T${b.end_time}`)
  );

  // 4. Remove existing bookings
  const { data: bookings, error } = await supabase
  .from("bookings")
  .select("*")
  .eq("seller_id", sellerId)
  .gte("start_time", `${isoDate}T00:00:00`)
  .lt("start_time", `${isoDate}T23:59:59`);

if (error) throw new Error(error.message);
  const bookedSlots = bookings.map(b => format(new Date(b.start_time), 'HH:mm'));

  // 5. Final available slots
  const available = allSlots.filter(
    slot => !breakSlots.includes(slot) && !bookedSlots.includes(slot)
  );

  return available;
}
