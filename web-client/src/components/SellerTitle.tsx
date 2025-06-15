import React from 'react';
import { Seller } from '../types/types';
import { MapPin, Star, Clock, ExternalLink } from 'lucide-react';

interface SellerTitleProps {
  seller?: Seller;
  bannerUrl?: string;
  profileUrl?: string;
}

const SellerTitle: React.FC<SellerTitleProps> = ({ seller, bannerUrl, profileUrl }) => {
  if (!seller) return null;

  const {
    name,
    address,
    category,
    // You can fetch this from seller.rating in future
  } = seller;

  const rating = 5.0;
  const reviews = 143;

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative w-full h-[400px] bg-base-200 overflow-hidden">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt={`${name} banner`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/5 to-primary/10" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent" />
      </div>

      {/* Profile and Title Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="avatar mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
              {profileUrl ? (
                <img 
                  src={profileUrl}
                  alt={`${name} profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-base-300 flex items-center justify-center">
                  <span className="text-4xl font-bold text-base-content/20">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-base-content">{name}</h1>
            
            <div className="badge badge-primary badge-lg font-medium">
              {category}
            </div>

            {/* Rating and Reviews */}
            <div className="flex flex-wrap justify-center items-center gap-2 text-base-content/70">
              <div className="flex items-center gap-1">
                <div className="rating rating-sm">
                  {Array.from({ length: 5 }, (_, i) => (
                    <input
                      key={i}
                      type="radio"
                      name={`rating-${seller.id}`}
                      className="mask mask-star-2 bg-primary"
                      checked={i === Math.floor(rating) - 1}
                      readOnly
                    />
                  ))}
                </div>
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-primary font-medium">
                ({reviews} reviews)
              </span>

              {/* Divider */}
              <span className="text-base-content/30">•</span>

              {/* Status */}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-error font-medium">Closed</span>
                <span>– Opens today at 09:00</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center justify-center gap-2 text-base-content/70">
              <MapPin className="w-4 h-4" />
              <span>{address}</span>
              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 link link-primary font-medium"
              >
                Get directions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerTitle;