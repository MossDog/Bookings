import React, { useState } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface BusinessDetails {
  address: string;
  phone: string;
  hours: string;
}

interface Business {
  name: string;
  details: BusinessDetails;
  hasMultipleServices: boolean;
  services: Service[];
}

interface HomePageProps {
  business: Business;
  onServiceSelect: (service: Service) => void;
  onShowMoreServices: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ business, onServiceSelect, onShowMoreServices }) => {
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
        {/* Hero Section */}
        <div className="relative w-full h-72 bg-gradient-to-r from-indigo-600 to-violet-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">{business.name}</h1>
            <div className="flex flex-col md:flex-row gap-6 text-white/90">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{business.details.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span className="text-sm">{business.details.phone}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">{business.details.hours}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="max-w-5xl mx-auto w-full px-4 py-12">
          {business.hasMultipleServices ? (
            <>
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 tracking-tight">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.services.slice(0, 4).map(service => (
                  <div 
                    key={service.id} 
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-100"
                    onClick={() => handleServiceClick(service)}
                  >
                    <h3 className="text-lg font-medium text-slate-900 mb-2 tracking-tight">{service.name}</h3>
                    <p className="text-indigo-600 font-medium text-lg">{service.price}</p>
                  </div>
                ))}
              </div>
              
              {business.services.length > 4 && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={onShowMoreServices}
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  >
                    View All Services
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center mt-8">
              <button 
                className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-medium text-lg shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                onClick={() => onServiceSelect(business.services[0])}
              >
                Book Now
              </button>
            </div>
          )}
        </div>
        
        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 animate-fade-in-up shadow-xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">{selectedService.name}</h3>
              <p className="text-indigo-600 font-medium text-xl mb-2">{selectedService.price}</p>
              <div className="flex items-center mb-6 text-slate-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{selectedService.duration}</span>
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

export default HomePage;