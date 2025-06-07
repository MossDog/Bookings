import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Seller } from '../../types/types';
import supabase from '../../utils/supabase';

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
        .from('Seller')
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
      <p>Name: {seller?.name}</p>
      <p>Address: {seller?.address}</p>
      <p>Category: {seller?.category}</p>
      <p>Address: {seller?.address}</p>
    </div>
  )
}
