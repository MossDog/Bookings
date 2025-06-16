import { format, addMinutes } from "date-fns";
import supabase from "./supabase";

/**
 * Book a slot for a logged-in user with a specific service
 * @param sellerId - Seller's `id` (UUID, from `seller.id`, not `user_id`)
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

    // Fetch the selected service (duration only; no need for name if you're joining later)
    const { data: service, error: serviceError } = await supabase
      .from("service")
      .select("duration")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return { success: false, message: "Service not found" };
    }

    const duration = service.duration;

    // Calculate start and end time
    const dateString = format(date, "yyyy-MM-dd");
    const startDateTime = new Date(`${dateString}T${slot}`);
    const endDateTime = addMinutes(startDateTime, duration);

    // Insert booking (no need for service_name anymore — it's normalized)
    const { error: insertError } = await supabase.from("bookings").insert([
      {
        seller_id: sellerId,        // Must be seller.id (UUID)
        user_id: userId,            // auth user
        service_id: serviceId,      // FK to service.id
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: "confirmed",        // Optional: default is probably already "confirmed"
      },
    ]);

    if (insertError) {
      return {
        success: false,
        message: `Failed to book slot: ${insertError.message}`,
      };
    }

    return { success: true, message: "Booking successful!" };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Unexpected error occurred",
    };
  }
}