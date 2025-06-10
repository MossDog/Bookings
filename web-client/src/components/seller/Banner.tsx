import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../utils/supabase';

interface BannerData {
  image_url: string;
}

export default function Banner() {
  const { userId } = useParams();
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('Banner')
        .select('image_url')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching banner:', error.message);
      } else {
        setBanner(data);
      }
    };

    fetchBanner();
  }, [userId]);

  if (!banner?.image_url) return null;

  return (
    <div style={{ width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
      <img
        src={banner.image_url}
        alt="Banner"
        style={{ width: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}