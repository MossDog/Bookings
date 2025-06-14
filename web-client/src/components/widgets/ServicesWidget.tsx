import React, { useEffect, useState } from "react";
import { Service } from "../../types/types";
import supabase from "@/utils/supabase";
import { Link } from "react-router-dom";
import { formatDuration } from "@/utils/formatDuration";
import BookServiceModal from "../BookingServiceModal";

interface ServicesWidgetProps {
  userId?: string; // Optional: allows passing userId from parent
}

const DISPLAY_LIMIT = 5;

const normalizeCategory = (value?: string) =>
  value?.trim().toLowerCase() || "";

const ServicesWidget: React.FC<ServicesWidgetProps> = ({ userId: externalUserId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [userId, setUserId] = useState<string | null>(externalUserId || null);

  useEffect(() => {
    if (!externalUserId) {
      const fetchUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      };
      fetchUserId();
    }
  }, [externalUserId]);

  useEffect(() => {
    if (!userId) return;

    const getServices = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("service")
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
      <div role="tablist" className="tabs tabs-border flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            onClick={() => setActiveCategory(cat)}
            className={`tab transition ${
              activeCategory === cat ? "tab-active text-primary" : "text-base-content"
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

      {/* Services */}
      <div className="min-h-[500px] md:min-h-[600px] lg:min-h-[650px] space-y-4">
        {limited.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="card card-bordered shadow-sm bg-base-100 cursor-pointer hover:bg-base-200 transition"
          >
            <div className="card-body flex-row justify-between items-center">
              <div>
                <h3 className="card-title">{service.name}</h3>
                <p className="text-sm text-base-content/60">
                  {formatDuration(service.duration)}
                </p>
                <p className="text-sm mt-1">Costs €{service.price.toFixed(2)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(service);
                }}
                className="btn btn-outline btn-sm text-primary"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* See More */}
      <div className="flex justify-center mt-4">
        <Link to="/" className="btn btn-outline btn-sm md:btn-md lg:btn-md">
          See more
        </Link>
      </div>

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