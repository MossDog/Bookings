import { DateTime } from 'luxon';
import supabase from './supabase';
import type { WorkingHours, Break, Holiday } from '../types/types';

/**
 * Generate 15-minute time slots between two Luxon DateTime objects
 */
function generateTimeSlots(start: DateTime, end: DateTime): string[] {
  const slots: string[] = [];

  let current = start;
  while (current < end) {
    slots.push(current.toFormat('HH:mm'));
    current = current.plus({ minutes: 15 });
  }

  return slots;
}

/**
 * Fetch rows from Supabase with a match filter
 */
async function fetchTable<T = unknown>(table: string, match: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').match(match);
  if (error) throw new Error(error.message);
  return data as T[];
}

/**
 * Main function: get available slots for a given seller and date
 */
export async function getAvailableSlots(sellerId: string, date: Date): Promise<string[]> {
  const selectedDay = DateTime.fromJSDate(date).startOf('day');
  const isoDate = selectedDay.toFormat('yyyy-MM-dd');
  const weekday = selectedDay.weekday % 7; // Luxon: Monday=1, JS: Sunday=0

  // 1. Get working hours for this weekday
  const workingHours = await fetchTable<WorkingHours>('seller_working_hours', {
    user_id: sellerId,
    day_of_week: weekday,
  });

  if (!workingHours.length) return [];

  const workStart = DateTime.fromISO(`${isoDate}T${workingHours[0].start_time}`);
  const workEnd = DateTime.fromISO(`${isoDate}T${workingHours[0].end_time}`);
  const allSlots = generateTimeSlots(workStart, workEnd);

  // 2. Check holidays
  const holidays = await fetchTable<Holiday>('seller_holidays', { user_id: sellerId });
  const isHoliday = holidays.some(h => DateTime.fromISO(h.date).toISODate() === isoDate);
  if (isHoliday) return [];

  // 3. Remove break slots
  const breaks = await fetchTable<Break>('seller_breaks', {
    user_id: sellerId,
    day_of_week: weekday,
  });

  const breakSlots = breaks.flatMap(b => {
    const breakStart = DateTime.fromISO(`${isoDate}T${b.start_time}`);
    const breakEnd = DateTime.fromISO(`${isoDate}T${b.end_time}`);
    return generateTimeSlots(breakStart, breakEnd);
  });

  // 4. Remove booked slots
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('seller_id', sellerId)
    .gte('start_time', `${isoDate}T00:00:00`)
    .lt('start_time', `${isoDate}T23:59:59`);

  if (error) throw new Error(error.message);

  const bookedSlots: string[] = [];
  bookings.forEach((booking) => {
    let start = DateTime.fromISO(booking.start_time);
    const end = DateTime.fromISO(booking.end_time);

    while (start < end) {
      bookedSlots.push(start.toFormat('HH:mm'));
      start = start.plus({ minutes: 15 });
    }
  });

  // 5. Final slots = not in breaks or bookings
  return allSlots.filter(
    (slot) => !breakSlots.includes(slot) && !bookedSlots.includes(slot)
  );
}