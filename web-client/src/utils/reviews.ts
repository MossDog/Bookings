import supabase from "@/utils/supabase";
import { Review } from "@/types/types";

export async function submitReview({
  bookingId,
  sellerId,
  userId,
  rating,
  comment,
}: {
  bookingId: number;
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

export async function getReviewCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", userId);

  if (error) {
    console.error("Failed to fetch review count:", error.message);
    return 0;
  }

  return count || 0;
}

export async function getPaginatedReviews(sellerId: string, page: number, limit: number = 5) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user_id", { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching reviews:", error.message);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}
