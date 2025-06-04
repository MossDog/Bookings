import React, { useEffect, useState } from "react";
import supabase from '../../utils/supabase';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

const ServicesWidget: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
    try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("Service")
            .select("id, name, description, price") as { data: Service[]; error: Error | null };

        if (error) {
            throw new Error("Failed to fetch services. Please try again later.");
        }

        setServices(data || []);
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Our Services</h2>

      {isLoading && <p className="text-center text-gray-500">Loading services...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!isLoading && !error && services.length === 0 && (
        <p className="text-center text-gray-500">No services available at the moment.</p>
      )}

      {services.map((service) => (
        <div
        key={service.id}
        className="grid grid-cols-3 gap-4 border rounded-lg p-4 shadow-md bg-white items-center"
      >
        <h3 className="text-gray-700 text-xl font-semibold">{service.name}</h3>
        <p className="text-gray-700">{service.description}</p>
        <p className="text-blue-600 font-bold text-right">${service.price.toFixed(2)}</p>
      </div>
      ))}
    </div>
  );
};

export default ServicesWidget;