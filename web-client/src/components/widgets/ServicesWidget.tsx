import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://diuvtcenidxquipjwyzh.supabase.co/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpdXZ0Y2VuaWR4cXVpcGp3eXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2Mjg1OTUsImV4cCI6MjA2NDIwNDU5NX0.pSjwZrhhQQa2NpOQ5b1pytfEnYsYWB1sOvvVe_-w0no";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

const ServicesWidget: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, description, price");

      if (error) {
        setError("Failed to fetch services.");
        console.error(error);
      } else {
        setServices(data || []);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Our Services</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {services.map((service) => (
        <div
          key={service.id}
          className="border rounded-lg p-4 shadow-md bg-white"
        >
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="text-gray-700">{service.description}</p>
          <p className="text-blue-600 font-bold">${service.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default ServicesWidget;