import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import supabase from '../utils/supabase';
import { Seller } from '../types/types';
import SellerBrowser from '@/components/SellerBrowser';

export default function ExploreBusinesses() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('seller')
          .select('*');

        if (error) throw error;

        setSellers(data || []);
      } catch (err) {
        setError('Failed to load businesses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div>
      <Navbar />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <SellerBrowser sellers={sellers} />
    </div>
  );

}