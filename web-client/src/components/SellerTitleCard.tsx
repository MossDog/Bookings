import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seller } from '@/types/types';
import OpeningHoursWidget from './OpeningHours';
import supabase from '@/utils/supabase';

const SellerTitleCard: React.FC = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('seller')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.error(error);
        navigate('/');
      } else {
        setSeller(data);
      }

      setLoading(false);
    };

    fetchSeller();
  }, [userId]);

  if (loading) return <div className="text-center text-sm text-gray-500">Loading seller info...</div>;
  if (!seller) return null;

  const { name, address, timezone, user_id } = seller;
  const rating = 5.0;
  const reviews = 143;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-5 bg-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-4xl font-bold text-gray-900">{name}</h2>

          <div className="flex items-center justify-center text-sm text-gray-600 space-x-2">
            <span className="font-medium">{rating.toFixed(1)}</span>
            <div className="rating rating-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <input
                  key={i}
                  type="radio"
                  className="mask mask-star-2 bg-primary"
                  readOnly
                  checked
                />
              ))}
            </div>
            <span className="text-gray-500">({reviews})</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-center text-gray-500">{address}</p>

        {/* Directions */}
        <div className="text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline btn-primary"
          >
            Get Directions
          </a>
        </div>

        {/* Hours */}
        <OpeningHoursWidget sellerId={user_id} timezone={timezone} />

        {/* Closed Status (demo only — replace with dynamic logic if needed) */}
        <div className="text-center text-sm text-primary font-medium mt-2">
          Closed <span className="text-gray-500">– opens on Monday at 09:00</span>
        </div>
      </div>
    </div>
  );
};

export default SellerTitleCard;