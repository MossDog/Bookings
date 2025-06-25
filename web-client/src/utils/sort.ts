// utils/sort.ts
import { Seller } from "@/types/types";

export function sortSellers(
  sellers: Seller[],
  sortBy: "Newest" | "Popular" | "Rating",
): Seller[] {
  switch (sortBy) {
    case "Newest":
      return [...sellers].sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime(),
      );
    case "Popular":
      return [...sellers].sort(
        (a, b) => (b.popularity_score || 0) - (a.popularity_score || 0),
      );
    case "Rating":
      return [...sellers].sort(
        (a, b) => (b.average_rating || 0) - (a.average_rating || 0),
      );
    default:
      return sellers;
  }
}
