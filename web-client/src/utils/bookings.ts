import { format, addMinutes } from "date-fns";
import supabase from "./supabase";
import { getUser } from "./auth";


export async function bookSlot(
  sellerId: string,
  serviceId: number,
  date: Date,
  slot: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user
    const user = await getUser();

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const userId = user.id;

    // Fetch the selected service (name + duration)
    const { data: service, error: serviceError } = await supabase
      .from("service")
      .select("name, duration")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return { success: false, message: "Service not found" };
    }

    const serviceName = service.name;
    const duration = service.duration;

    // Calculate start and end time
    const dateString = format(date, "yyyy-MM-dd");
    const startDateTime = new Date(`${dateString}T${slot}`);
    const endDateTime = addMinutes(startDateTime, duration);

    // Insert booking
    const { error: insertError } = await supabase.from("bookings").insert([
      {
        seller_id: sellerId,
        user_id: userId,
        service_id: serviceId,
        service_name: serviceName,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
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
