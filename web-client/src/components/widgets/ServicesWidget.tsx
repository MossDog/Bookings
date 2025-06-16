import React, { useEffect, useState } from "react";
import { Service } from "../../types/types";
import supabase from "@/utils/supabase";
import { Link } from "react-router-dom";
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";
import { Clock, Euro, ChevronRight } from 'lucide-react';

interface ServicesWidgetProps {
  services?: Service[];
  userId?: string;  // Add userId prop
}

const DISPLAY_LIMIT = 5;

const normalizeCategory = (value?: string) =>
  value?.trim().toLowerCase() || "";

const ServicesWidget: React.FC<ServicesWidgetProps> = ({ services, userId }: ServicesWidgetProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (!services) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-base-content">Services</h2>
          <div className="tabs tabs-bordered w-full justify-center animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 bg-base-200 rounded-lg mx-1"></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-200 shadow animate-pulse">
              <div className="card-body">
                <div className="h-6 bg-base-300 rounded w-1/4"></div>
                <div className="h-4 bg-base-300 rounded w-1/3"></div>
                <div className="h-4 bg-base-300 rounded w-1/5"></div>
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
  const filtered = normalizedActive === "all"
    ? services
    : services.filter(
        (s) => normalizeCategory(s.category) === normalizedActive
      );

  const limited = filtered.slice(0, DISPLAY_LIMIT);

  


  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold text-base-content">Services</h2>
          {filtered.length > 0 && (
            <div className="badge badge-primary badge-lg">{filtered.length} services</div>
          )}
        </div>

        {/* Categories */}
        <div className="tabs tabs-bordered w-full justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                tab tab-lg transition-all duration-200 
                ${activeCategory === cat 
                  ? "tab-active text-primary border-primary" 
                  : "text-base-content/70 hover:text-base-content"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-base-200 rounded-lg p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-base-content/70 font-medium">No services available in this category</p>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {limited.map((service) => (          <div
            key={service.id}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="card-body">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">                  <h3 className="card-title text-base-content group-hover:text-primary transition-colors mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-6 text-base-content/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatDuration(service.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="text-lg font-bold text-primary">
                        {service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More */}
      {filtered.length > DISPLAY_LIMIT && (
        <div className="flex justify-center pt-4">
          <Link 
            to="/" 
            className="btn btn-outline btn-wide gap-2 group hover:btn-primary"
          >
            View All Services
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Modal */}
      {selectedService && userId && (
        <BookServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default ServicesWidget;