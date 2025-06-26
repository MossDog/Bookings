import { Service, WeekSchedule } from "@/types/types";
import { User } from "@supabase/supabase-js";
import supabase from "./supabase";
import { createSlug, generateUniqueSlug } from "./slug";
import { DateTime } from "luxon";
import { WorkingHours } from "@/types/types";

// Convert day string to number (0 = Sunday, 1 = Monday, etc.)
const getDayNumber = (day: string): number => {
  const dayMap: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return dayMap[day];
};

export interface ProfileCreationData {
  user?: User;
  name: string;
  description?: string;
  address?: string;
  category: string;
  services?: Service[];
}

export const getProfileFromSlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("seller")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  } else {
    return data;
  }
};

export const getServicesFromId = async (userId: string) => {
  const { data, error } = await supabase
    .from("service")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching services:", error);
    return null;
  }

  return data;
};

export const createSellerProfile = async (
  details: ProfileCreationData,
  schedule: WeekSchedule,
) => {
  try {
    if (!details.user) {
      throw new Error(`Failed to create seller profile: user not found`);
    }

    const slug = await generateUniqueSlug(createSlug(details.name), "seller");

    const { error: sellerError } = await supabase.from("seller").insert({
      user_id: details.user.id,
      name: details.name,
      description: details.description || "",
      address: details.address || "",
      category: details.category,
      slug,
    });

    if (sellerError) {
      throw new Error(
        `Failed to create seller profile: ${sellerError.message}`,
      );
    }

    if (details.services && details.services.length > 0) {
      const { error: servicesError } = await supabase.from("service").insert(
        details.services.map((service) => ({
          ...service,
          user_id: details.user!.id,
        })),
      );

      if (servicesError) {
        throw new Error(`Failed to create services: ${servicesError.message}`);
      }
    }

    const { error: openingHoursError } = await supabase
      .from("seller_working_hours")
      .insert(
        Object.entries(schedule)
          .filter(([_, daySchedule]) => !daySchedule.isClosed)
          .map(([day, daySchedule]) => ({
            user_id: details.user!.id,
            day_of_week: getDayNumber(day),
            start_time: daySchedule.openTime,
            end_time: daySchedule.closeTime,
          })),
      );

    if (openingHoursError) {
      throw new Error(
        `Failed to create working hours: ${openingHoursError.message}`,
      );
    }

    const { error: breakHoursError } = await supabase
      .from("seller_breaks")
      .insert(
        Object.entries(schedule).flatMap(([day, daySchedule]) =>
          (daySchedule.breaks || []).map((breakTime) => ({
            user_id: details.user!.id,
            day_of_week: getDayNumber(day),
            start_time: breakTime.startTime,
            end_time: breakTime.endTime,
          })),
        ),
      );

    if (breakHoursError) {
      throw new Error(
        `Failed to create break hours: ${breakHoursError.message}`,
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating seller profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const deleteSellerProfile = async (userId: string) => {
  try {
    // delete all services associated with the seller
    const { error: servicesError } = await supabase
      .from("service")
      .delete()
      .eq("user_id", userId);

    if (servicesError) {
      throw new Error(
        `Failed to delete seller services: ${servicesError.message}`,
      );
    }

    const { error: faqError } = await supabase
      .from('faq')
      .delete()
      .eq("user_id", userId);

    if(faqError) {
      throw new Error(
        `Failed to delete seller faq: ${faqError.message}`,
      );
    }

    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq("seller_id", userId);

    if(reviewsError) {
      throw new Error(
        `Failed to delete seller reviews: ${reviewsError.message}`,
      );
    }

    const { error: sellerBreaksError } = await supabase
      .from('seller_breaks')
      .delete()
      .eq("user_id", userId);

    if(sellerBreaksError) {
      throw new Error(
        `Failed to delete seller breaks: ${sellerBreaksError.message}`,
      );
    }

    const { error: sellerHolidaysError } = await supabase
      .from('seller_holidays')
      .delete()
      .eq("user_id", userId);

    if(sellerHolidaysError) {
      throw new Error(
        `Failed to delete seller holidays: ${sellerHolidaysError.message}`,
      );
    }

    const { error: sellerWorkingHoursError } = await supabase
      .from('seller_working_hours')
      .delete()
      .eq("user_id", userId);

    if(sellerWorkingHoursError) {
      throw new Error(
        `Failed to delete seller working hours: ${sellerWorkingHoursError.message}`,
      );
    }


    // Then delete seller profile
    const { error: sellerError } = await supabase
      .from("seller")
      .delete()
      .eq("user_id", userId);

    if (sellerError) {
      throw new Error(
        `Failed to delete seller profile: ${sellerError.message}`,
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting seller profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export function isSellerOpen(now: DateTime, workingHours: WorkingHours[]): boolean {
  if (!workingHours.length) return false;

  const todayISO = now.toFormat("yyyy-MM-dd");
  const start = DateTime.fromISO(`${todayISO}T${workingHours[0].start_time}`);
  const end = DateTime.fromISO(`${todayISO}T${workingHours[0].end_time}`);

  return now >= start && now <= end;
}