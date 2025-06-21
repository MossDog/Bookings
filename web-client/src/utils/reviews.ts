import supabase from "@/utils/supabase";
import { Review } from "@/types/types";

export async function submitReview(review: Omit<Review, "id" | "created_at" | "verified">) {
  const { data, error } = await supabase.from("reviews").insert([review]);

  if (error) throw new Error(error.message);
  return data;
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