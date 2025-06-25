import { DateTime } from "luxon";
import supabase from "./supabase";
import type { WorkingHours, Break, Holiday } from "../types/types";
import { fetchTable } from "./dbdao";

export const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export async function getAvailableSlots(
  sellerId: string,
  date: Date,
  sellerTimezone: string,
): Promise<string[]> {
  const INTERVAL = 15; //TODO: Pull this from seller in db

  const selectedDay = DateTime.fromJSDate(date, {
    zone: sellerTimezone,
  }).startOf("day");
  const isoDate = selectedDay.toFormat("yyyy-MM-dd");
  const weekday = selectedDay.weekday % 7;

  // 1. Get working hours
  const workingHours = await fetchTable<WorkingHours>("seller_working_hours", {
    user_id: sellerId,
    day_of_week: weekday,
  });

  if (!workingHours.length) return [];

  const workStart = DateTime.fromISO(
    `${isoDate}T${workingHours[0].start_time}`,
    { zone: sellerTimezone },
  );
  const workEnd = DateTime.fromISO(`${isoDate}T${workingHours[0].end_time}`, {
    zone: sellerTimezone,
  });
  const allSlots = generateTimeSlots(workStart, workEnd, INTERVAL);

  // 2. Check holidays
  const holidays = await fetchTable<Holiday>("seller_holidays", {
    user_id: sellerId,
  });
  const isHoliday = holidays.some(
    (h) =>
      DateTime.fromISO(h.date, { zone: sellerTimezone }).toISODate() ===
      isoDate,
  );
  if (isHoliday) return [];

  // 3. Remove break slots
  const breaks = await fetchTable<Break>("seller_breaks", {
    user_id: sellerId,
    day_of_week: weekday,
  });

  const breakSlots = breaks.flatMap((b) => {
    const breakStart = DateTime.fromISO(`${isoDate}T${b.start_time}`, {
      zone: sellerTimezone,
    });
    const breakEnd = DateTime.fromISO(`${isoDate}T${b.end_time}`, {
      zone: sellerTimezone,
    });
    return generateTimeSlots(breakStart, breakEnd, INTERVAL);
  });

  // 4. Remove booked slots (convert from UTC to seller local time)
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("seller_id", sellerId)
    .eq("status", "confirmed")
    .gte("start_time", `${isoDate}T00:00:00`)
    .lt("start_time", `${isoDate}T23:59:59`);

  if (error) throw new Error(error.message);

  const bookedSlots: string[] = [];
  bookings.forEach((booking) => {
    let start = DateTime.fromISO(booking.start_time);
    const end = DateTime.fromISO(booking.end_time);

    while (start < end) {
      bookedSlots.push(start.toFormat("HH:mm"));
      start = start.plus({ minutes: INTERVAL });
    }
  });

  // 5. Final slots
  return allSlots.filter(
    (slot) => !breakSlots.includes(slot) && !bookedSlots.includes(slot),
  );
}

function generateTimeSlots(
  start: DateTime,
  end: DateTime,
  interval: number,
): string[] {
  const slots: string[] = [];

  let current = start;
  while (current < end) {
    slots.push(current.toFormat("HH:mm"));
    current = current.plus({ minutes: interval });
  }

  return slots;
}
