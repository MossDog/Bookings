import React, { useEffect, useState } from "react";
import { Service } from '../../types/types';
import supabase from '../../utils/supabase';
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";
import { Clock, Euro } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Featured Services</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-200 shadow-lg min-w-[250px] shrink-0 animate-pulse">
              <div className="card-body">
                <div className="h-4 bg-base-300 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-base-300 rounded w-3/4"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-base-300 rounded w-full"></div>
                  <div className="h-4 bg-base-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-base-content">Featured Services</h2>
        {services.length > 0 && (
          <div className="badge badge-primary">{services.length} services</div>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-base-200 rounded-lg p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-base-content/70 font-medium">No featured services available yet</p>
          </div>
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 snap-x">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[280px] max-w-[280px] shrink-0 snap-start cursor-pointer group"
            >              <div className="card-body">
                <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                
                <p className="text-base-content/70 text-sm line-clamp-2 min-h-[2.5rem]">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-4 mt-4 text-base-content/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(service.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Euro className="w-4 h-4" />
                    <span className="text-lg font-bold text-primary">
                      {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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