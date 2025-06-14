import { Service } from "@/types/types";
import { User } from "@supabase/supabase-js";
import supabase from "./supabase";
import { WeekSchedule } from "@/components/seller/profile-creation/SellerOpeningHours";

// Convert day string to number (0 = Sunday, 1 = Monday, etc.)
const getDayNumber = (day: string): number => {
    const dayMap: { [key: string]: number } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
    };
    return dayMap[day];
};

export interface ProfileCreationData {
    user: User;
    name: string;
    description?: string;
    address?: string;
    category: string;
    services?: Service[];
}

export const createSellerProfile = async (details: ProfileCreationData, schedule: WeekSchedule) => {
    try {
        const { error: sellerError } = await supabase
            .from('seller')
            .insert({
                user_id: details.user.id,
                name: details.name,
                description: details.description || '',
                address: details.address || '',
                category: details.category
            });

        if(sellerError) {
            throw new Error(`Failed to create seller profile: ${sellerError.message}`)
        }

        if(details.services && details.services.length > 0) {
            const { error: servicesError } = await supabase
                .from('service')
                .insert(
                    details.services.map(service => ({
                        ...service,
                        category: details.category,
                        user_id: details.user.id
                    }))
                );
            
                if(servicesError) {
                    throw new Error(`Failed to create services: ${servicesError.message}`);
                }
        }        
        
        const {error: openingHoursError } = await supabase
            .from('seller_working_hours')
            .insert(
                Object.entries(schedule)
                    .filter(([_, daySchedule]) => !daySchedule.isClosed)
                    .map(([day, daySchedule]) => ({
                        user_id: details.user.id,
                        day_of_week: getDayNumber(day),
                        start_time: daySchedule.openTime,
                        end_time: daySchedule.closeTime
                    }))
            );

        if(openingHoursError) {
            throw new Error(`Failed to create working hours: ${openingHoursError.message}`);
        }

        const { error: breakHoursError } = await supabase
            .from('seller_breaks')
            .insert(
            Object.entries(schedule)
                .flatMap(([day, daySchedule]) =>
                (daySchedule.breaks || []).map(breakTime => ({
                    user_id: details.user.id,
                    day_of_week: getDayNumber(day),
                    start_time: breakTime.startTime,
                    end_time: breakTime.endTime
                }))
                )
            );

        if(breakHoursError) {
            throw new Error(`Failed to create break hours: ${breakHoursError.message}`);
        }

        return { success: true }
    } catch (error) {
        console.error('Error creating seller profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

export const deleteSellerProfile = async (userId: string) => {
    try {
        // delete all services associated with the seller
        const { error: servicesError } = await supabase
            .from('Service')
            .delete()
            .eq('user_id', userId);

        if (servicesError) {
            throw new Error(`Failed to delete seller services: ${servicesError.message}`);
        }

        // Then delete seller profile
        const { error: sellerError } = await supabase
            .from('seller')
            .delete()
            .eq('user_id', userId);

        if (sellerError) {
            throw new Error(`Failed to delete seller profile: ${sellerError.message}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting seller profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}