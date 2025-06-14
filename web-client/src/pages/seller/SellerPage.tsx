import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Seller } from '../../types/types';
import supabase from '../../utils/supabase';
import Navbar from '../../components/Navbar';
// import Banner from '@/components/seller/Banner';
// import ProfilePicture from '@/components/seller/ProfilePicture';
import ServicesWidget from '@/components/widgets/ServicesWidget';
import SellerTitle from '@/components/SellerTitle';
import HighlightWidget from '@/components/widgets/HighlightWidget';

export default function SellerPage() {
  const { userId } = useParams();
  const [seller, setSeller] = useState<Seller | undefined>();

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
        navigate("/");
      } else {
        setSeller(data);
      }
    };

    fetchSeller();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative">
        {/* <Banner bannerUrl={seller?.banner_url} />
        <ProfilePicture profileUrl={seller?.profile_url} /> */}
        <SellerTitle seller={seller} />
        <HighlightWidget userId={userId} />
        <ServicesWidget userId={userId} />
      </div>
    </div>
  );
}