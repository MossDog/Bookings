import React, { useState } from 'react';

import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';

interface Service {
  id: number;
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
  services: Service[];
  hasMultipleServices: boolean;
}

type PageType = 'home' | 'booking' | 'services';

const businessData: Business = {
  name: "Fresh Cuts Barbershop",
  details: {
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    hours: "Mon-Sat: 9am-7pm, Sun: Closed"
  },
  services: [
    { id: 1, name: "Men's Haircut", price: "$25", duration: "30 min", description: "Classic haircut includes wash, cut, and style." },
    { id: 2, name: "Beard Trim", price: "$15", duration: "15 min", description: "Professional beard shaping and trimming." },
    { id: 3, name: "Hair & Beard Combo", price: "$35", duration: "45 min", description: "Complete package with haircut and beard trim." },
    { id: 4, name: "Kids Haircut", price: "$20", duration: "20 min", description: "Haircut for children under 12." },
    { id: 5, name: "Hot Towel Shave", price: "$30", duration: "30 min", description: "Traditional hot towel shave with straight razor." },
    { id: 6, name: "Hair Coloring", price: "$50+", duration: "60+ min", description: "Professional hair coloring services." }
  ],
  hasMultipleServices: true
};

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
    setCurrentPage('booking');
  };
  
  const handleShowMoreServices = (): void => {
    setCurrentPage('services');
  };
  
  const handleBackToHome = (): void => {
    setCurrentPage('home');
  };
  
  return (
    <div>
      {currentPage === 'home' && (
        <HomePage 
          business={businessData} 
          onServiceSelect={handleServiceSelect}
          onShowMoreServices={handleShowMoreServices}
        />
      )}
      
      {currentPage === 'booking' && selectedService && (
        <BookingPage 
          service={selectedService}
          onBack={handleBackToHome}
        />
      )}
      
      {currentPage === 'services' && (
        <ServicesPage 
          business={businessData}
          onServiceSelect={handleServiceSelect}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
