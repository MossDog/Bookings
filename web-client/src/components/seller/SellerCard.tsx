import { Seller } from "@/types/types";
import { getPublicUrl } from "@/utils/bucket";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Store } from "lucide-react";

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({ seller }: SellerCardProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getBanner() {
      try {
        const url = await getPublicUrl(
          "public.images",
          `${seller.user_id}/bannerimage`,
        );

        setBannerUrl(url || null);
      } catch (error) {
        console.error("Error loading banner:", error);
        setBannerUrl(null);
      } finally {
        setIsLoading(false);
      }
    }

    getBanner();
  }, [seller]);

  return (
    <Link
      key={seller.slug}
      to={`${seller.slug}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 group"
    >
      {/* Card Image */}
      <figure className="relative h-48 bg-base-300">
        <div className="absolute inset-0 bg-gradient-to-t from-base-300 to-transparent opacity-50"></div>
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-base-300"></div>
        ) : bannerUrl ? (
          <img
            src={bannerUrl!}
            alt={seller.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-base-200">
            <Store className="w-12 h-12 text-base-content" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <div className="badge badge-primary">
            {seller.category || "Uncategorized"}
          </div>
        </div>
      </figure>
      <div className="card-body p-6">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-lg group-hover:text-primary transition-colors">
            {seller.name || "Unnamed Business"}
          </h2>
          <div className="flex items-center gap-1">
            <div className="rating rating-sm">
              <input
                type="radio"
                name={`rating-${seller.user_id}`}
                className="mask mask-star-2 bg-orange-400"
                checked
                readOnly
              />
              <input
                type="radio"
                name={`rating-${seller.user_id}`}
                className="mask mask-star-2 bg-orange-400"
                checked
                readOnly
              />
              <input
                type="radio"
                name={`rating-${seller.user_id}`}
                className="mask mask-star-2 bg-orange-400"
                checked
                readOnly
              />
              <input
                type="radio"
                name={`rating-${seller.user_id}`}
                className="mask mask-star-2 bg-orange-400"
                checked
                readOnly
              />
              <input
                type="radio"
                name={`rating-${seller.user_id}`}
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
            <span className="text-sm text-base-content/70">(4.0)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
          {seller.description || "No description provided."}
        </p>

        {/* Footer Info */}
        <div className="card-actions flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
           <MapPin size={18} />
            {seller.address || "Location not specified"}
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <Calendar size={18}/>
            Joined {new Date(seller.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
