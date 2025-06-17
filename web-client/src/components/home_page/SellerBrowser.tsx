import { Seller } from "@/types/types";
import SellerCard from "../SellerCard";

interface SellerBrowserProps {
  sellers: Seller[];
}

export default function SellerBrowser({ sellers }: SellerBrowserProps) {
  return (
    <>
      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button className="btn btn-ghost btn-sm">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            "Beauty & Wellness",
            "Health & Fitness",
            "Home Services",
            "Events & Entertainment",
          ].map((category) => (
            <button key={category} className="btn btn-outline min-w-max">
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Businesses</h2>
          <div className="join">
            <button className="btn join-item btn-sm">Newest</button>
            <button className="btn join-item btn-sm btn-active">Popular</button>
            <button className="btn join-item btn-sm">Rating</button>
          </div>
        </div>

        {sellers.length === 0 ? (
          <div className="text-center py-16 bg-base-200 rounded-box">
            <div className="max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-2">
                No businesses found
              </h3>
              <p className="text-base-content/70 mb-4">
                Be the first to add your business to our platform!
              </p>
              <button className="btn btn-primary">Add Your Business</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <SellerCard key={seller.user_id} seller={seller} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {sellers.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn btn-active">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn">3</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      )}
    </>
  );
}
