import { Seller } from "@/types/types";
import { haversineDistance } from "@/utils/distance";

export const filterSellersByCategory = (
  sellers: Seller[],
  category: string
): Seller[] => {
  if (category === "View All") return sellers;
  return sellers.filter((s) => s.category === category);
};

export const filterSellersByDistance = (
  sellers: Seller[],
  coords: { lat: number; lng: number },
  radius: number
): Seller[] => {
  return sellers.filter((seller) => {
    if (seller.lat == null || seller.lng == null) return false;
    const distance = haversineDistance(coords.lat, coords.lng, seller.lat, seller.lng);
    return distance <= radius;
  });
};