import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { getGoogleMapsUrl } from "../utils/maps";
import { Seller } from "@/types/types";

interface ShopMapWidgetProps {
  seller: Seller;
}

const ShopMapWidget: React.FC<ShopMapWidgetProps> = ({ seller }) => {
  const address = seller?.address;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-base-content">Visit Us</h2>

      <div className="bg-base-100 rounded-xl shadow-md p-6 space-y-4">
        {address ? (
          <>
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <p className="text-base-content font-medium leading-relaxed">
                {address}
              </p>
            </div>
            <iframe
              className="w-full h-60 rounded-md border border-base-300"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={getGoogleMapsUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Google Maps
            </a>
          </>
        ) : (
          <p className="text-base-content/70">No address available.</p>
        )}
      </div>
    </div>
  );
};

export default ShopMapWidget;