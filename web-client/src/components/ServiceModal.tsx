import React from "react";
import { Service } from "../types/types";

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
  onBook: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onBook }) => {
  return (
    <div className="fixed inset-0 bg-base-100/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 relative">
        
        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-center">{service.name}</h2>
        <p className="text-base-content/70 text-sm text-center">{service.description}</p>

        {/* Duration & Price */}
        <div className="flex items-center justify-center gap-4 text-base-content/70">
          <div className="flex items-center gap-1">
            <span className="text-sm">Duration:</span>
            <span className="font-medium">{service.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">Price:</span>
            <span className="text-lg font-bold text-primary">€{service.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between gap-2 pt-4">
          <button className="btn btn-ghost flex-1" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary flex-1" onClick={onBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;