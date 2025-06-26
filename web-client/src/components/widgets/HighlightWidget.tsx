import React, { useState } from "react";
import { Service } from "../../types/types";
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";
import { Clock, Euro } from "lucide-react";

interface HighlightWidgetProps {
  services: Service[];
  isLoading: boolean;
}

const HighlightWidget: React.FC<HighlightWidgetProps> = ({
  services,
  isLoading,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Featured Services</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card bg-base-200 shadow-lg min-w-[250px] shrink-0 animate-pulse"
            >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-base-content/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-base-content/70 font-medium">
              No featured services available yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-4 px-2 snap-x">
          {services.map((service) => (
            <div
              key={service.id}
              onMouseEnter={() => setHoveredServiceId(String(service.id))}
              onMouseLeave={() => setHoveredServiceId(null)}
              onClick={() => setSelectedService(service)}
              className={`card bg-base-100 shadow-md transition-all duration-300 min-w-[280px] max-w-[280px] shrink-0 snap-start cursor-pointer group ${
                hoveredServiceId === String(service.id) ? "shadow-2xl" : ""
              }`}
            >
              <div className="card-body">
                <h3
                  className={`card-title text-base-content transition-colors ${
                    hoveredServiceId === String(service.id) ? "text-primary" : ""
                  }`}
                >
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