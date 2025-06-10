import React, { useEffect, useState } from "react";
import { fetchServices } from '../../utils/dbdao';
import { Service } from '../../types/types';

const ServicesWidget: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getServices = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await fetchServices();

      if (error) {
        setError(error);
        console.error("Error fetching services:", error);
      } else {
        setServices(data);
      }

      setIsLoading(false);
    };

    getServices();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Our Services</h2>

      {isLoading && <p className="text-center">Loading services...</p>}
      {error && <p className="text-center">{error}</p>}

      {!isLoading && !error && services.length === 0 && (
        <p className="text-center">No services available at the moment.</p>
      )}

      {services.map((service) => (
        <div
          key={service.id}
          className="grid grid-cols-3 gap-4 border rounded-lg p-4 shadow-md items-center"
        >
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p>{service.description}</p>
          <p className="font-bold text-right">${service.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default ServicesWidget;