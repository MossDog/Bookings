import supabase from "@/utils/supabase";
import { Review } from "@/types/types";

export async function submitReview({
  bookingId,
  sellerId,
  userId,
  rating,
  comment,
}: {
  bookingId: string;
  sellerId: number;
  userId: string;
  rating: number;
  comment: string;
}) {
  const { error } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    seller_id: sellerId,
    user_id: userId,
    rating,
    comment,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Review submitted" };
}

export async function getUserReviewsForSeller(sellerId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Review[];
}

