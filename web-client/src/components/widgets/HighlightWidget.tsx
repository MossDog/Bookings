import React, { useEffect, useState } from "react";
import { Service } from '../../types/types';
import supabase from '../../utils/supabase';
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";

interface HighlightWidgetProps {
  userId?: string;
}

const HighlightWidget: React.FC<HighlightWidgetProps> = ({ userId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getServices = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        setError(error.message);
        console.error("Error fetching services:", error);
      } else {
        setServices(data);
      }

      setIsLoading(false);
    };

    getServices();
  }, [userId]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Highlights</h2>

      {isLoading && <p className="text-base-content/60">Loading highlights...</p>}
      {error && <p className="text-error">{error}</p>}
      {!isLoading && !error && services.length === 0 && (
        <p className="text-base-content/60">No highlighted services available.</p>
      )}

      <div className="flex overflow-x-auto space-x-4 pb-2">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="min-w-[200px] max-w-[200px] bg-base-100 rounded-xl shadow p-4 flex flex-col justify-between shrink-0 cursor-pointer hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-gray-500">{service.category || "service"}</p>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {service.description}
              </p>
              <p className="text-sm text-gray-600 mt-1">{formatDuration(service.duration)}</p>
            </div>
            <div className="mt-3 font-bold text-primary text-right">
              € {service.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <BookServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default HighlightWidget;