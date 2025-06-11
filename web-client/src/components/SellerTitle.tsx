import React from 'react';
import { Seller } from '../types/types';

interface SellerTitleProps {
  seller?: Seller;
}

const SellerTitle: React.FC<SellerTitleProps> = ({ seller }) => {
  if (!seller) return null;

  const {
    name,
    address,
    // You can fetch this from seller.rating in future
  } = seller;

  const rating = 5.0;
  const reviews = 143;


  return (
    <div className="mt-16 px-5">
      <div className="flex flex-col items-center text-center space-y-1">
        <h1 className="text-3xl font-bold">{name}</h1>
  
        <div className="flex flex-wrap justify-center items-center text-sm text-gray-700 space-x-2">
          {/* Rating */}
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <div className="flex text-black">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-purple-600 font-medium">({reviews})</span>
  
          {/* Separator */}
          <span className="text-gray-400 mx-1">•</span>
  
          {/* Status */}
          <span className="text-orange-700">Closed</span>
          <span>– opens on mercredi at 09:00</span>
  
          {/* Separator */}
          <span className="text-gray-400 mx-1">•</span>
  
          {/* Address */}
          <span>{address}</span>
  
          {/* Link */}
          <a
            href="https://maps.google.com"
            className="text-purple-600 hover:underline ml-2"
          >
            Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default SellerTitle;