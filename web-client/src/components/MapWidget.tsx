import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import supabase from "@/utils/supabase";

interface ShopMapWidgetProps {
  sellerId: string;
}

const ShopMapWidget: React.FC<ShopMapWidgetProps> = ({ sellerId }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      const { data, error } = await supabase
        .from("seller")
        .select("address")
        .eq("user_id", sellerId)
        .single();

      if (error || !data?.address) {
        console.error("Error fetching address:", error);
        setAddress(null);
      } else {
        setAddress(data.address);
      }
      setLoading(false);
    };

    fetchAddress();
  }, [sellerId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-base-content">Visit Us</h2>

      <div className="bg-base-100 rounded-xl shadow-md p-6 space-y-4">
        {loading ? (
          <p className="text-base-content/60">Loading address...</p>
        ) : address ? (
          <>
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <p className="text-base-content font-medium leading-relaxed">
                {address}
              </p>
            </div>
            <iframe
              className="w-full h-60 rounded-md border border-base-300"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                address
              )}&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </>
        ) : (
          <p className="text-base-content/70">No address available.</p>
        )}
      </div>
    </div>
  );
};

export default ShopMapWidget;
