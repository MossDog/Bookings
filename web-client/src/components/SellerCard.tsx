import { Seller } from "@/types/types";
import { getPublicUrl } from "@/utils/bucketUtils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({
  seller
}: SellerCardProps) {  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function getBanner() {
      setIsLoading(true);
      setImageError(false);
      try {
        const url = await getPublicUrl('public.images', `${seller.user_id}/bannerimage`);

        if(url) {
          setBannerUrl(url);
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error('Error loading banner:', error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getBanner();
  }, [seller])

  return (
    <Link
      key={seller.slug}
      to={`${seller.slug}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 group"
    >      {/* Card Image */}
      <figure className="relative h-48 bg-base-300">
        <div className="absolute inset-0 bg-gradient-to-t from-base-300 to-transparent opacity-50"></div>
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-base-300"></div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-base-200">
            <Store className="w-12 h-12 text-base-content" />
          </div>
        ) : (
          <img
            src={bannerUrl || '/test_Restaurant.jpeg'}
            alt={seller.name}
            className="w-full h-full object-cover"
            onError={() => {
              setImageError(true);
              setBannerUrl('/test_Restaurant.jpeg');
            }}
          />
        )}
        <div className="absolute top-4 right-4">
          <div className="badge badge-primary">{seller.category || 'Uncategorized'}</div>
        </div>
      </figure>

      <div className="card-body p-6">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-lg group-hover:text-primary transition-colors">
            {seller.name || 'Unnamed Business'}
          </h2>
          <div className="flex items-center gap-1">
            <div className="rating rating-sm">
              <input type="radio" name={`rating-${seller.user_id}`} className="mask mask-star-2 bg-orange-400" checked readOnly/>
              <input type="radio" name={`rating-${seller.user_id}`} className="mask mask-star-2 bg-orange-400" checked readOnly/>
              <input type="radio" name={`rating-${seller.user_id}`} className="mask mask-star-2 bg-orange-400" checked readOnly/>
              <input type="radio" name={`rating-${seller.user_id}`} className="mask mask-star-2 bg-orange-400" checked readOnly/>
              <input type="radio" name={`rating-${seller.user_id}`} className="mask mask-star-2 bg-orange-400" />
            </div>
            <span className="text-sm text-base-content/70">(4.0)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
          {seller.description || 'No description provided.'}
        </p>

        {/* Footer Info */}
        <div className="card-actions flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {seller.address || 'Location not specified'}
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Joined {new Date(seller.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  )
}
