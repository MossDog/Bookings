import supabase from "./supabase";

export async function cancelBooking(bookingId: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Booking cancelled" };
}
