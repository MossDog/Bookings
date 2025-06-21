import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/types/types";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface SellerServicesSetupProps {
  onNewService: (service: Service) => void;
  services: Service[];
}

export default function SellerServicesSetup({
  onNewService,
  services,
}: SellerServicesSetupProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(10);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const user = useUser();

  const addService = () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const newService = { name, price, duration, description, user_id: user.id };

    onNewService(newService);

    // Reset form
    setName("");
    setDescription("");
    setPrice(10);
    setDuration(30);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
      {/* Service Creation Form */}
      <div className="card bg-base-100 shadow-md h-full">
        <div className="bg-base-200/50 p-6 border-b border-base-200">
          <h3 className="text-xl font-semibold text-base-content">
            Add a Service
          </h3>
          <p className="text-base-content/70 text-sm mt-1">
            Define the services your business provides
          </p>
        </div>

        <div className="card-body p-6 space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Service Name</span>
            </label>
            <input
              className="input input-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Enter service name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Price</span>
              </label>
              <div className="join w-full">
                <span className="join-item flex items-center px-4 bg-base-200 font-medium">
                  €
                </span>
                <input
                  type="number"
                  className="input input-bordered join-item w-full focus:ring-2 focus:ring-primary/20 transition-all"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Duration</span>
              </label>
              <select
                className="select select-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Describe what this service includes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                Be specific about what's included in the service
              </span>
            </label>
          </div>

          <button
            className="btn btn-primary w-full gap-2"
            onClick={addService}
            disabled={!name || !description || !price}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="card bg-base-100 shadow-md h-full">
        <div className="bg-base-200/50 p-6 border-b border-base-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-base-content">
              Your Services
            </h3>
            <div className="badge badge-primary badge-lg">
              {services.length} total
            </div>
          </div>
          <p className="text-base-content/70 text-sm mt-1">
            Manage your service offerings
          </p>
        </div>

        <div className="card-body p-6 h-full">
          {services.length === 0 ? (
            <div className="text-center h-full py-12 bg-base-200/30 rounded-lg">
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
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h4 className="text-lg font-medium mb-2">
                No services added yet
              </h4>
              <p className="text-base-content/70">
                Start by adding your first service using the form
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
