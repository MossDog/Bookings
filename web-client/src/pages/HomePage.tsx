import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import supabase from '../utils/supabase';
import { Seller } from '../types/types';
import GalleryWidget from '@/components/widgets/Gallery/GalleryWidget';

export default function ExploreBusinesses() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('Seller')
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

  <main className="p-6 bg-base-100 text-base-content">
    <h1 className="text-3xl font-bold mb-6">Explore Businesses</h1>

    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sellers.map((seller) => (
        <Link
          key={seller.user_id}
          to={`/${seller.user_id}/profile`}
          className="block border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-base-200 bg-base-100 text-base-content"
        >
          <h2 className="text-xl font-semibold mb-1">
            {seller.name || 'Unnamed Business'}
          </h2>

          <p className="text-sm text-base-content/70 mb-2">
            {seller.description || 'No description provided.'}
          </p>

          <p className="text-sm text-base-content/60 mb-1">
            <span className="font-medium">Category:</span> {seller.category || 'N/A'}
          </p>

          <p className="text-sm text-base-content/60 mb-1">
            <span className="font-medium">Address:</span> {seller.address || 'N/A'}
          </p>

          <p className="text-xs text-base-content/40">
            Joined on {new Date(seller.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  </main>
</div>
  );

}