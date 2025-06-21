import { Booking, Seller, Service } from '@/types/types';
import { getServiceById, getSellers } from '@/utils/seller';
import { useEffect, useState } from 'react';
import UserBookingModal from './UserBookingModal';

interface UserBookingCardProps {
  booking: Booking;
}

export default function UserBookingCard({ booking }: UserBookingCardProps) {
  const [service, setService] = useState<Service | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const fetchedService = await getServiceById(booking.service_id);
      setService(fetchedService ?? null);

      if (fetchedService?.user_id) {
        const allSellers = await getSellers();
        const matchedSeller = allSellers.find(
          (s) => s.user_id === fetchedService.user_id
        );
        setSeller(matchedSeller ?? null);
      }

      setLoading(false);
    }

    fetchData();
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
    <>
      <div
        className="card bg-base-100 shadow-md p-4 cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <div className="font-bold text-lg">{service.name}</div>
        <div className="text-base-content/70">
          Booking status: {booking.status}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(booking.start_time).toLocaleDateString()} —{' '}
          {new Date(booking.start_time).toLocaleTimeString()} to{' '}
          {new Date(booking.end_time).toLocaleTimeString()}
        </div>
        {seller?.name && (
          <div className="text-base-content/70">With: {seller.name}</div>
        )}
        <div className="text-sm text-gray-500">€{service.price}</div>
      </div>

      {openModal && seller && (
        <UserBookingModal
          booking={booking}
          service={service}
          seller={seller}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
}