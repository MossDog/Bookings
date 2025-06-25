import supabase from "./supabase";

export async function getFeaturedFaqs(userId: string) {
  const { data, error } = await supabase
    .from("faq")
    .select("id, question, answer")
    .eq("user_id", userId)
    .eq("is_featured", true)
    .limit(5);

  if (error) {
    console.error("Error fetching featured FAQs:", error.message);
    return [];
  }

  return data || [];
}
