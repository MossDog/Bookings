import { Seller } from "@/types/types";

export function filterSellersByCategory(
  sellers: Seller[],
  category: string
): Seller[] {
  return category === "View All"
    ? sellers
    : sellers.filter((seller) => seller.category === category);
}