import { Seller } from "@/types/types";
import OpeningHoursWidget from "../OpeningHours";
import { MapPin, ExternalLink } from "lucide-react";

interface SellerTitleCardProps {
  seller?: Seller;
}

function SellerTitleCard({ seller }: SellerTitleCardProps) {
  if (!seller) {
    return (
      <div className="card bg-base-100 shadow-xl animate-pulse">
        <div className="card-body items-center text-center space-y-6">
          <div className="h-8 bg-base-200 rounded-full w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-base-200 rounded-full w-16"></div>
            <div className="h-4 bg-base-200 rounded-full w-24"></div>
          </div>
          <div className="h-4 bg-base-200 rounded-full w-1/2"></div>
          <div className="h-8 bg-base-200 rounded-full w-32"></div>
          <div className="w-full h-32 bg-base-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const { name, address, timezone, user_id } = seller;
  const rating = 5.0;
  const reviews = 143;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body items-center text-center space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-base-content">{name}</h2>

          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <div className="rating rating-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    className="mask mask-star-2 bg-primary"
                    readOnly
                    checked
                  />
                ))}
              </div>
              <span className="font-medium text-base-content">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-primary font-medium">
              ({reviews} reviews)
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-base-content/70">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{address}</p>
          </div>

          <a
            href={`https://maps.google.com/maps?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm gap-2"
          >
            Get Directions
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Hours */}
        <div className="w-full">
          <OpeningHoursWidget sellerId={user_id} timezone={timezone} />
        </div>

        {/* Open Status */}
        <div className="flex items-center gap-2 text-base-content/70">
          <div className="badge badge-error gap-2">Closed</div>
          <span className="text-sm">Opens Monday at 09:00</span>
        </div>
      </div>
    </div>
  );
}

export default SellerTitleCard;
