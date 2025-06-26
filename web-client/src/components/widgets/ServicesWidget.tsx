import React, { useState } from "react";
import { Service } from "../../types/types";
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";
import { Clock, Euro, ChevronRight, PackageOpen } from "lucide-react";

interface ServicesWidgetProps {
  services?: Service[];
  isLoading: boolean;
}

const DISPLAY_LIMIT = 5;

const normalizeCategory = (value?: string) => value?.trim().toLowerCase() || "";

const ServicesWidget: React.FC<ServicesWidgetProps> = ({
  services,
  isLoading,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  if (isLoading || !services) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-base-content">Services</h2>
          <div className="tabs tabs-bordered w-full justify-center animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="tab tab-bordered h-10 px-6 bg-base-200 rounded-lg mx-1"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-200 shadow animate-pulse">
              <div className="card-body space-y-4">
                <div className="h-6 bg-base-300 rounded w-1/3" />
                <div className="h-4 bg-base-300 rounded w-3/4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-base-300 rounded w-20" />
                  <div className="h-4 bg-base-300 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categoryMap = new Map<string, string>();
  services.forEach((s) => {
    if (s.category) {
      const norm = normalizeCategory(s.category);
      if (!categoryMap.has(norm)) {
        categoryMap.set(norm, s.category.trim());
      }
    }
  });

  const categories = ["All", ...Array.from(categoryMap.values()).sort()];
  const normalizedActive = normalizeCategory(activeCategory);
  const filtered =
    normalizedActive === "all"
      ? services
      : services.filter(
          (s) => normalizeCategory(s.category) === normalizedActive,
        );

  const limited = filtered.slice(0, DISPLAY_LIMIT);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold text-base-content">Services</h2>
          {filtered.length > 0 && (
            <div className="badge badge-primary badge-lg">
              {filtered.length} services
            </div>
          )}
        </div>

        {/* Categories */}
        {/* <div className="tabs tabs-bordered w-full justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab tab-lg transition-all duration-200 ${
                activeCategory === cat
                  ? "tab-active text-primary border-primary"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-base-200 rounded-lg p-8">
            <PackageOpen className="h-12 w-12 mx-auto text-base-content/30 mb-4" />
            <p className="text-base-content/70 font-medium">
              No services available in this category
            </p>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {limited.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            onMouseEnter={() => setHoveredServiceId(String(service.id))}
            onMouseLeave={() => setHoveredServiceId(null)}
            className={`card bg-base-100 shadow-md transition-all duration-300 cursor-pointer ${
              hoveredServiceId === String(service.id) ? "hover:shadow-lg" : ""
            }`}
          >
            <div className="card-body">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`card-title mb-2 transition-colors ${
                      hoveredServiceId === String(service.id)
                        ? "text-primary"
                        : "text-base-content"
                    }`}
                  >
                    {service.name}
                  </h3>
                  <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-6 text-base-content/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="text-lg font-bold text-primary">
                        {service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Book Now
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More */}
      {filtered.length > DISPLAY_LIMIT && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setActiveCategory("All")}
            className="btn btn-outline btn-wide gap-2 group hover:btn-primary"
          >
            View All Services
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedService && (
        <BookServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default ServicesWidget;
