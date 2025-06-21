import { Booking, Service } from '@/types/types';
import { getServiceById } from '@/utils/seller';
import { useEffect, useState } from 'react';
import UserBookingModal from './UserBookingModal';
import { getPublicUrl } from '@/utils/bucket';
import { Calendar, Clock, BadgeCheck, XCircle } from 'lucide-react';
import { DateTime } from 'luxon';

interface UserBookingCardProps {
  booking: Booking;
}

export default function UserBookingCard({
  booking
}: UserBookingCardProps) {
  const [service, setService] = useState<Service | null>();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const s = await getServiceById(booking.service_id);
      setService(s ?? null);
      const url = await getPublicUrl('public.images', `${booking.seller_id}/bannerimage`);
      setBannerUrl(url || "/test_Restaurant.jpeg");
      setLoading(false);
    }

    fetchData();
  }, [booking]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md p-4 animate-pulse w-full max-w-xl mx-auto">
        <div className="h-40 bg-base-200 rounded mb-4"></div>
        <div className="h-6 bg-base-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="card bg-base-100 shadow-md p-4 text-error w-full max-w-xl mx-auto">
        Service information could not be loaded.
      </div>
    );
  }

  // Format date and time
  const start = DateTime.fromISO(booking.start_time);
  const end = DateTime.fromISO(booking.end_time);
  const dateStr = start.toLocaleString(DateTime.DATE_MED);
  const timeStr = `${start.toLocaleString(DateTime.TIME_SIMPLE)} - ${end.toLocaleString(DateTime.TIME_SIMPLE)}`;

  // Status badge color
  let statusColor = 'badge-ghost';
  let statusIcon = null;
  if (booking.status === 'confirmed') {
    statusColor = 'badge-success';
    statusIcon = <BadgeCheck className="w-4 h-4 mr-1" />;
  } else if (booking.status === 'pending') {
    statusColor = 'badge-warning';
    statusIcon = <Clock className="w-4 h-4 mr-1" />;
  } else if (booking.status === 'cancelled') {
    statusColor = 'badge-error';
    statusIcon = <XCircle className="w-4 h-4 mr-1" />;
  }

  return (
    <div className="card bg-base-100 shadow-lg w-full max-w-xl mx-auto group transition hover:shadow-xl cursor-pointer" onClick={() => setOpenModal(true)}>
      <figure className="relative h-40 w-full overflow-hidden rounded-t-xl bg-base-200">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Seller banner" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/30">No Image</div>
        )}
        <span className={`absolute top-4 right-4 badge ${statusColor} badge-lg flex items-center gap-1 shadow-md`}>{statusIcon}{booking.status}</span>
      </figure>
      <div className="card-body p-5">
        <div className="flex items-center gap-2 mb-2 text-base-content/70 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{dateStr}</span>
          <Clock className="w-4 h-4 ml-4" />
          <span>{timeStr}</span>
        </div>
        <h2 className="card-title text-lg text-base-content mb-1">{service.name}</h2>
        <div className="text-base-content/70 text-sm mb-2">Booking status: <span className={`font-semibold capitalize`}>{booking.status}</span></div>
        <div className="flex justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={e => { e.stopPropagation(); setOpenModal(true); }}
          >
            View Details
          </button>
        </div>
      </div>
      {openModal && (
        <UserBookingModal
          booking={booking}
          service={service}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
