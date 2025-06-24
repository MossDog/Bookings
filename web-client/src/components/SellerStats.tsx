import { Clock } from "lucide-react";

interface SellerStatsProps {
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  nextOpeningTime?: string;
}

export default function SellerStats({
  rating,
  reviewCount,
  isOpen,
  nextOpeningTime,
}: SellerStatsProps) {
  const starArray = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 text-base-content/70">
      
      {/* Rating */}
      <div className="flex items-center gap-1">
        <div className="rating rating-sm">
          {starArray.map((i) => (
            <input
              key={i}
              type="radio"
              name="rating-display"
              className="mask mask-star-2 bg-primary"
              checked={i === Math.round(rating)}
              readOnly
            />
          ))}
        </div>
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>

      {/* Reviews */}
      <span className="text-primary font-medium">
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>

      {/* Divider */}
      <span className="text-base-content/30">•</span>

      {/* Status */}
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {isOpen ? (
          <span className="text-success font-medium">Open Now</span>
        ) : nextOpeningTime ? (
          <span className="text-error font-medium">
            Closed – Opens at {nextOpeningTime}
          </span>
        ) : (
          <span className="text-error font-medium">Closed</span>
        )}
      </div>
    </div>
  );
}