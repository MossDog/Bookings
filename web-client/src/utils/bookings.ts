import { format, addMinutes } from "date-fns";
import supabase from "./supabase";
import { BookingStatus } from "@/types/types";


export async function bookSlot(
  userId: string,
  sellerId: string,
  serviceId: number,
  date: Date,
  slot: string,
): Promise<{ success: boolean; message: string }> {
  try {

    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Fetch the selected service (name + duration)
    const { data: service, error: serviceError } = await supabase
      .from("service")
      .select("name,duration")
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


    // Insert booking
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
      return {
        success: false,
        message: `Failed to book slot: ${insertError.message}`,
      };
    }

    return { success: true, message: "Booking successful!" };
  } catch (err) {
    return {
      success: false,
      message: err as string || "Unexpected error occurred",
    };
  }
}

export async function cancelBooking(bookingId: number) {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Booking cancelled" };
}

export const updateBookingStatus = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) {
        console.error("Failed to update booking:", error);
        return;
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };