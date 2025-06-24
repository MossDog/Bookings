import SellerSearchBar from "@/components/SellerSearchBar";
import { getCacheBustedSupabaseImageUrl } from "@/utils/bucket";

export default function HeroSection() {
  // Use a static cache-busted URL for the hero background
  const heroBgUrl = getCacheBustedSupabaseImageUrl(
    "city_maps/gregory-dalleau-KT4dOfvtZSg-unsplash.jpg"
  );
  return (
    <div
      className="hero min-h-[40vh] rounded-box mb-12 px-6 py-24"
      style={{
        backgroundImage: `url('${heroBgUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content text-center">
        <div className="max-w-2xl w-full relative">
          {/* Blurred overlay background */}
          <div className="absolute inset-0 bg-base-200/60 backdrop-blur-sm rounded-box z-0" />

          {/* Foreground content */}
          <div className="relative z-10 p-8">
            <h1 className="text-4xl font-bold mb-4 text-base-content">
              Discover Local Businesses
            </h1>
            <p className="text-lg text-base-content/70 mb-6">
              Find and book services from trusted local businesses in your area
            </p>
            <SellerSearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}