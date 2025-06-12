import { Seller } from "@/types/types";
import SellerCard from "./SellerCard";

interface SellerBrowserProps {
  sellers: Seller[];
}

export default function SellerBrowser({
  sellers
}: SellerBrowserProps) {
  return (
    <main className="container mx-auto px-4 py-8 bg-base-100 text-base-content min-h-screen">
      {/* Hero Section */}
      <div className="hero bg-base-200 rounded-box mb-12 p-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Discover Local Businesses</h1>
            <p className="text-base-content/70 text-lg mb-6">
              Find and book services from trusted local businesses in your area
            </p>
            <div className="join w-full max-w-md bg-base-100 shadow-lg">
              <input 
                className="input join-item input-bordered w-full" 
                placeholder="Search by business name or category..."
              />
              <button className="btn join-item btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button className="btn btn-ghost btn-sm">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {['Beauty & Wellness', 'Health & Fitness', 'Home Services', 'Events & Entertainment'].map((category) => (
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
              <h3 className="font-semibold text-lg mb-2">No businesses found</h3>
              <p className="text-base-content/70 mb-4">Be the first to add your business to our platform!</p>
              <button className="btn btn-primary">Add Your Business</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <SellerCard key={seller.user_id} seller={seller}/>
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
    </main>
  )
}
