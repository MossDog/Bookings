import supabase from "../../utils/supabase";
import { fetchServices } from "../../utils/dbdao";
import { DateTime } from "luxon";

export async function bookSlot(
  sellerId: string,
  serviceId: number,
  date: Date,
  slot: string,
  sellerTimezone: string = "Europe/Dublin"
): Promise<{ success: boolean; message: string }> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "User not authenticated" };
    }

    const userId = user.id;

    // Fetch service duration
    const { data: services, error: serviceError } = await fetchServices(sellerId);
    if (serviceError || !services) {
      return { success: false, message: "Could not fetch services" };
    }

    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService || !selectedService.duration) {
      return { success: false, message: "Invalid service or missing duration" };
    }

    const duration = selectedService.duration;

    // Calculate slot start and end
    const start = DateTime.fromFormat(
      `${date.toISOString().split("T")[0]} ${slot}`,
      "yyyy-MM-dd HH:mm",
      { zone: sellerTimezone }
    );
    const end = start.plus({ minutes: duration });

    if (!start.isValid) {
      return { success: false, message: "Invalid slot time" };
    }

    // Convert to UTC
    const startUTC = start.toUTC().toISO();
    const endUTC = end.toUTC().toISO();

    // Overlap check using lt and gt logic
    const { data: overlapping, error: overlapError } = await supabase
      .from("bookings")
      .select("id")
      .eq("seller_id", sellerId)
      .lt("end_time", endUTC)
      .gt("start_time", startUTC);

    if (overlapError) {
      return { success: false, message: "Error checking for conflicts" };
    }

    if (overlapping.length > 0) {
      return { success: false, message: "That slot is already booked. Please pick another." };
    }

    // Insert booking
    const { error: insertError } = await supabase.from("bookings").insert([
      {
        seller_id: sellerId,
        user_id: userId,
        service_id: serviceId,
        start_time: startUTC,
        end_time: endUTC,
      },
    ]);

    if (insertError) {
      return { success: false, message: "Failed to create booking" };
    }

    return { success: true, message: "Booking successful!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Unknown error" };
  }
}