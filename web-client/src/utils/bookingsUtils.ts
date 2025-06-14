import { format, addMinutes } from "date-fns";
import supabase from "./supabase";
import { fetchServices } from "./dbdao"; // Adjust path if needed

/**
 * Book a slot for a logged-in user with a specific service
 * @param sellerId - Seller's UUID
 * @param serviceId - ID of the selected service
 * @param date - The date being booked
 * @param slot - Time in 'HH:mm' format
 */
export async function bookSlot(
  sellerId: string,
  serviceId: number,
  date: Date,
  slot: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "User not authenticated" };
    }

    const userId = user.id;

    // 1. Fetch services to get duration
    const { data: services, error: serviceError } = await fetchServices(sellerId);
    if (serviceError) {
      return { success: false, message: "Could not fetch service duration" };
    }

    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService || !selectedService.duration) {
      return { success: false, message: "Invalid service or missing duration" };
    }

    const duration = selectedService.duration;

    // 2. Calculate start and end time
    const dateString = format(date, "yyyy-MM-dd");
    const startDateTime = new Date(`${dateString}T${slot}`);
    const endDateTime = addMinutes(startDateTime, duration);

    // 3. Insert booking
    const { error: insertError } = await supabase.from("bookings").insert([
      {
        seller_id: sellerId,
        user_id: userId,
        service_id: serviceId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      },
    ]);

    if (insertError) {
      return { success: false, message: `Failed to book slot: ${insertError.message}` };
    }

    return { success: true, message: "Booking successful!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Unexpected error occurred" };
  }
}