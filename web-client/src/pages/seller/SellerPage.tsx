import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Seller } from '../../types/types';
import supabase from '../../utils/supabase';
import Navbar from '../../components/Navbar';
import ServicesWidget from '@/components/widgets/ServicesWidget';
import SellerTitle from '@/components/SellerTitle';
import HighlightWidget from '@/components/widgets/HighlightWidget';
import SellerTitleCard from '../../components/SellerTitleCard';
import { getPublicUrl } from '@/utils/bucketUtils';

export default function SellerPage() {
  const { userId } = useParams();
  const [seller, setSeller] = useState<Seller | undefined>();

  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>(undefined);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

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

      if (error) {
        console.error(error);
        navigate('/');
      } else {
        setSeller(data);
      }

      const bannerUrl = await getPublicUrl('public.images', `${userId}/bannerimage`);
      const profileUrl = await getPublicUrl('public.images', `${userId}/profileimage`);

      setBannerImageUrl(bannerUrl || undefined);
      setProfileImageUrl(profileUrl || undefined);
    };

    fetchSeller();
  }, []);

  return (
    <div>
      <Navbar />
      <SellerTitle seller={seller} bannerUrl={bannerImageUrl} profileUrl={profileImageUrl}/>
  
      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 md:px-10 gap-6 mt-8">
        {/* Left Side: Main Content */}
        <div className="flex-1 max-w-4xl">
          <HighlightWidget userId={userId} />
          <ServicesWidget userId={userId} />
        </div>
  
        {/* Right Side: Sidebar (hidden on small screens) */}
        <div className="hidden lg:block w-full max-w-[460px]">
          <div className="sticky top-28">
            <SellerTitleCard />
          </div>
        </div>
      </div>
    </div>
  );
}