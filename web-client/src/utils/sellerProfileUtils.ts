import { Service } from "@/types/types";
import { User } from "@supabase/supabase-js";
import supabase from "./supabase";

export interface ProfileCreationData {
    user: User;
    name: string;
    description?: string;
    address?: string;
    category: string;
    services?: Service[];
}

export const createSellerProfile = async (details: ProfileCreationData) => {
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
                .from('Service')
                .insert(
                    details.services.map(service => ({
                        ...service,
                        user_id: details.user.id
                    }))
                );
            
                if(servicesError) {
                    throw new Error(`Failed to create services: ${servicesError.message}`);
                }
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