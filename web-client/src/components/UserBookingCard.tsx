import { Booking, Service } from '@/types/types';
import { getServiceById } from '@/utils/seller';
import { useEffect, useState } from 'react';
import UserBookingModal from './UserBookingModal';

interface UserBookingCardProps {
  booking: Booking;
}

export default function UserBookingCard({
  booking
}: UserBookingCardProps) {
  const [service, setService] = useState<Service | null>();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function getService(){
      setLoading(true);
      const s = await getServiceById(booking.service_id);
      setService(s ?? null);
      setLoading(false);
    }

    getService();
  }, [booking]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md p-4 animate-pulse">
        <div className="h-6 bg-base-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-base-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="card bg-base-100 shadow-md p-4 text-error">
        Service information could not be loaded.
      </div>
    );
  }

  return (
    <div 
      className="card bg-base-100 shadow-md p-4 cursor-pointer"
    
    >
      <div className="font-bold text-lg">{service.name}</div>
      <div className="text-base-content/70">Booking status: {booking.status}</div>
      
      { openModal && (
        <UserBookingModal 
          booking={booking}
          service={service}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
