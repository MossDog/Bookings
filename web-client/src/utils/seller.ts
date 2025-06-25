import { AllSellerData, Seller, Service, SellerPreview, FAQ } from "@/types/types";
import supabase from "./supabase";

export async function getSellers(): Promise<Seller[]> {
  try {
    const { data, error } = await supabase
      .from("seller")
      .select("*")
      .overrideTypes<Seller[], { merge: false }>();

    if (error) {
      console.error("Error fetching all sellers:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    throw error;
  }
}

export async function fetchAllSellerData(
  sellerId: string,
): Promise<AllSellerData> {
  const { data: sellerData, error: sellerError } = await supabase
    .from("seller")
    .select("*")
    .eq("user_id", sellerId)
    .single();

  if (sellerError) {
    console.error("Seller not found");
  }

  const { data: servicesData, error: servicesError } = await supabase
    .from("service")
    .select("*")
    .eq("user_id", sellerId);

  if (servicesError) {
    console.error("Seller services error");
  }

  const { data: bookingsData, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .eq("seller_id", sellerId);

  if (bookingsError) {
    console.error("Seller bookings error");
  }

  const data: AllSellerData = {
    seller: sellerData,
    services: servicesData || [],
    bookings: bookingsData || [],
  };

  return data;
}

export async function getAvailableDates(sellerId: string): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_available_dates", {
    seller_uuid: sellerId,
  });

  if (error || !data) {
    console.error("Error fetching available dates:", error?.message);
    return [];
  }

  return data.map((row: { day: string }) => row.day.split("T")[0]);
}

export const fetchServices = async (
  userId: string,
): Promise<{ data: Service[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("service")
      .select("id, name, description, price, category, duration, user_id")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to fetch services. Please try again later.");
    }

    return { data: data || [], error: null };
  } catch (err) {
    return {
      data: [],
      error:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
};

export async function fetchAddressBySellerId(
  sellerId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("seller")
    .select("address")
    .eq("user_id", sellerId)
    .single();

  if (error || !data?.address) {
    console.error("Error fetching address:", error);
    return null;
  }

  return data.address;
}

export const getServiceById = async (id: number) => {
  const { data, error } = await supabase
    .from("service")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(`Error fetching service with ID ${id}`);
    return null;
  }

  return data as Service;
};

export async function searchSellersByName(
  name: string,
): Promise<SellerPreview[]> {
  const { data, error } = await supabase
    .from("seller")
    .select("user_id, name, slug, category")
    .ilike("name", `%${name}%`); // now using `name` to filter

  if (error) {
    console.error("Error searching sellers:", error.message);
    return [];
  }

  return (data || []) as SellerPreview[];
}

export async function getProfileFromSlug(slug: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from("seller")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching seller by slug:", error.message);
    return null;
  }

  return data as Seller;
}

export const updateWidgetOrder = async (
  sellerId: string,
  widgetOrder: string[],
): Promise<boolean> => {
  const { error } = await supabase
    .from("seller")
    .update({ widget_order: widgetOrder })
    .eq("user_id", sellerId);

  if (error) {
    console.error("Error updating widget order:", error.message);
    return false;
  }

  return true;
};

export async function updateAboutUs(sellerId: string, aboutUs: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("seller")
      .update({
        about_us: aboutUs
      })
      .eq("user_id", sellerId);

    if (error) {
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Error updating seller's about us:", err);
    return false;
  }
}

export async function fetchFAQs(sellerId: string): Promise<FAQ[]> {
  try {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .eq("user_id", sellerId)
      .order("is_featured", { ascending: false }); // Featured FAQs first

    if (error) {
      throw error;
    }

    return data as FAQ[];
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    return [];
  }
}

export async function insertFAQ(sellerId: string, question: string, answer: string, isFeatured: boolean = false): Promise<{ success: boolean; data?: FAQ; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("faq")
      .insert({
        user_id: sellerId,
        question: question.trim(),
        answer: answer.trim(),
        is_featured: isFeatured
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: data as FAQ };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create FAQ";
    console.error("Error inserting FAQ:", err);
    return { success: false, error: errorMessage };
  }
}

export async function updateFAQ(faqId: string, updates: Partial<Pick<FAQ, 'question' | 'answer' | 'is_featured'>>): Promise<{ success: boolean; data?: FAQ; error?: string }> {
  try {
    // Trim text fields if they exist in updates
    const cleanUpdates = {
      ...updates,
      ...(updates.question && { question: updates.question.trim() }),
      ...(updates.answer && { answer: updates.answer.trim() })
    };

    const { data, error } = await supabase
      .from("faq")
      .update(cleanUpdates)
      .eq("id", faqId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: data as FAQ };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update FAQ";
    console.error("Error updating FAQ:", err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteFAQ(faqId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("faq")
      .delete()
      .eq("id", faqId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete FAQ";
    console.error("Error deleting FAQ:", err);
    return { success: false, error: errorMessage };
  }
}