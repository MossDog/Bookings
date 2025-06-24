
// SellerTitle.tsx
import React from "react";
import { Seller } from "../../types/types";
import { MapPin, ExternalLink } from "lucide-react";
import SellerStats from "@/components/SellerStats";

interface SellerTitleProps {
  seller?: Seller;
  bannerUrl?: string;
  profileUrl?: string;
  rating: number;
  reviewCount: number;
}

const SellerTitle: React.FC<SellerTitleProps> = ({ seller, bannerUrl, profileUrl, rating, reviewCount }) => {
  if (!seller) return null;

  return (
    <div className="relative">
      <div className="relative w-full h-[400px] bg-base-200 overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl} alt={`${seller.name} banner`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/5 to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-24 flex flex-col items-center">
          <div className="avatar mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
              {profileUrl ? (
                <img src={profileUrl} alt={`${seller.name} profile`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-base-300 flex items-center justify-center">
                  <span className="text-4xl font-bold text-base-content/20">{seller.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-base-content">{seller.name}</h1>
            <div className="badge badge-primary badge-lg font-medium">{seller.category}</div>

            <SellerStats rating={rating} reviewCount={reviewCount} isOpen={false} nextOpeningTime="09:00" />

            <div className="flex items-center justify-center gap-2 text-base-content/70">
              <MapPin className="w-4 h-4" />
              <span>{seller.address}</span>
              <a href={`https://maps.google.com/maps?q=${encodeURIComponent(seller.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 link link-primary font-medium">
                Get directions <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerTitle;