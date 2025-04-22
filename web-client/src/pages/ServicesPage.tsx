import React, { useState } from 'react';
import { ChevronLeft, Clock, ChevronRight } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface Business {
  name: string;
  services: Service[];
}

interface ServicesPageProps {
  business: Business;
  onServiceSelect: (service: Service) => void;
  onBack: () => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ business, onServiceSelect, onBack }) => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    
    const handleServiceClick = (service: Service): void => {
      setSelectedService(service);
    };
    
    const handleBookNow = (): void => {
      if (selectedService) {
        onServiceSelect(selectedService);
      }
    };
    
    const handleCloseSheet = (): void => {
      setSelectedService(null);
    };
    
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white px-4 py-6 shadow-sm border-b border-slate-100">
          <div className="max-w-5xl mx-auto flex items-center">
            <button 
              onClick={onBack} 
              className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">All Services</h1>
          </div>
        </div>
        
        {/* Services List */}
        <div className="max-w-5xl mx-auto w-full px-4 py-8">
          <div className="grid grid-cols-1 gap-4">
            {business.services.map(service => (
              <div 
                key={service.id} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-100"
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 tracking-tight">{service.name}</h3>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-600">{service.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-indigo-600 font-medium text-lg mr-3">{service.price}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 animate-fade-in-up shadow-xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">{selectedService.name}</h3>
              <p className="text-indigo-600 font-medium text-xl mb-2">{selectedService.price}</p>
              <div className="flex items-center mb-6 text-slate-600">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">{selectedService.duration}</span>
              </div>
              <p className="text-slate-700 mb-8 leading-relaxed">{selectedService.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button 
                  className="px-6 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                  onClick={handleCloseSheet}
                >
                  Close
                </button>
                <button 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default ServicesPage;