import { useState } from "react";
import { Seller } from "@/types/types";
import SellerCard from "../seller/SellerCard";
import { filterSellersByCategory } from "@/utils/filter";
import { sortSellers } from "@/utils/sort";

interface SellerBrowserProps {
  sellers: Seller[];
}

const CATEGORIES = [
  "View All",
  "Beauty & Wellness",
  "Health & Fitness",
  "Home Services",
  "Events & Entertainment",
  "Food & Dining",
];

export default function SellerBrowser({ sellers }: SellerBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("View All");
  const [sortBy, setSortBy] = useState<"Newest" | "Popular" | "Rating">(
    "Popular",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const sellersPerPage = 9;

  const filteredSellers = filterSellersByCategory(sellers, selectedCategory);
  const sortedSellers = sortSellers(filteredSellers, sortBy);

  // Pagination logic
  const totalPages = Math.ceil(sortedSellers.length / sellersPerPage);
  const indexOfLast = currentPage * sellersPerPage;
  const indexOfFirst = indexOfLast - sellersPerPage;
  const currentSellers = sortedSellers.slice(indexOfFirst, indexOfLast);

  // Reset to first page when category or sort changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: "Newest" | "Popular" | "Rating") => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`btn min-w-max ${
                selectedCategory === category ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCategory === "View All"
            ? "Featured Businesses"
            : selectedCategory}
        </h2>
        <div className="join">
          {["Newest", "Popular", "Rating"].map((label) => (
            <button
              key={label}
              className={`btn join-item btn-sm ${
                sortBy === label ? "btn-active" : ""
              }`}
              onClick={() => handleSortChange(label as typeof sortBy)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Seller Cards */}
      {currentSellers.length === 0 ? (
        <div className="text-center py-16 bg-base-200 rounded-box">
          <div className="max-w-md mx-auto">
            <h3 className="font-semibold text-lg mb-2">No businesses found</h3>
            <p className="text-base-content/70 mb-4">
              Be the first to add your business to our platform!
            </p>
            <button className="btn btn-primary">Add Your Business</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSellers.map((seller) => (
            <SellerCard key={seller.user_id} seller={seller} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn ${page === currentPage ? "btn-active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="join-item btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </>
  );
}
