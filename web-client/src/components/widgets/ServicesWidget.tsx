import React, { useEffect, useState } from "react";
import { Service } from "../../types/types";
import supabase from "@/utils/supabase";
import { Link } from "react-router-dom";
import { formatDuration } from "@/utils/formatDuration";

interface ServicesWidgetProps {
  userId?: string;
}

const DISPLAY_LIMIT = 5;

const normalizeCategory = (value?: string) =>
  value?.trim().toLowerCase() || "";

const ServicesWidget: React.FC<ServicesWidgetProps> = ({ userId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getServices = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Service")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        setError(error.message);
        console.error("Error fetching services:", error);
      } else {
        setServices(data || []);
      }

      setIsLoading(false);
    };

    getServices();
  }, [userId]);

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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Prestation</h2>
  
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto text-sm font-medium">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap border transition ${
              activeCategory === cat
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
  
      {/* Status */}
      {isLoading && (
        <p className="text-center text-base-content/60">Loading services...</p>
      )}
      {error && <p className="text-error text-center">{error}</p>}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-center text-base-content/60">
          No services in this category.
        </p>
      )}
  
      {/* Service cards */}
      <div className="space-y-4">
        {limited.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white hover:bg-gray-50 cursor-pointer transition"
          >
            <div>
              <h3 className="font-semibold text-base text-gray-900">
                {service.name}
              </h3>
              {service.duration && (
                <p className="text-sm text-gray-500">
                  {formatDuration(service.duration)}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Costs €{service.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedService(service);
              }}
              className="border border-gray-300 px-4 py-1 rounded-full text-sm hover:bg-gray-100"
            >
              Book
            </button>
          </div>
        ))}
      </div>
  
      {/* See More button */}
      {filtered.length > DISPLAY_LIMIT && (
  <div className="flex justify-center">
    <Link to="/" className="px-6 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition">
      See more
    </Link>
  </div>
)}
    </div> // ✅ This closes the root <div>
  )};

export default ServicesWidget;