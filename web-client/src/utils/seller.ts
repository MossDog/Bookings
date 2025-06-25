import { AllSellerData, Seller, Service, SellerPreview } from "@/types/types";
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
