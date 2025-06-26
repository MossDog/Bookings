import supabase from "@/utils/supabase";
import { UserProfile } from "@/types/types";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }

  return data as UserProfile;
}