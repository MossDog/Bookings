import React, { useState } from 'react'
import ProtectedRoute from '../ProtectedRoute'
import FormInput from '../FormInput'
import supabase from '../../utils/supabase';
import GridImageSlot from '../widgets/Gallery/GridImageSlot';
import ImageSlot from '../widgets/Gallery/ImageSlot';

export default function SellerCoreAccountCreationForm() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!name || !description || !address || !category) {
        throw new Error('Please fill in all fields');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('Authentication error. Please try again.');
      }

      const { error: insertError } = await supabase
        .from('Seller')
        .insert({
          user_id: sessionData.session.user.id,
          description,
          name,
          address,
          category
        });

      if (insertError) {
        throw new Error('Failed to create seller account');
      }

      // Handle success
      console.log('Seller account created successfully');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 min-w-[480px]">
      <h1 className='text-2xl font-bold'>Basic Info</h1>
      <div className='flex gap-2'>
        <div className='flex flex-col gap-3 min-w-[480px]'>
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Enter business name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="Describe your business"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Enter business address"
              className="input input-bordered w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <select 
              className="select select-bordered w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="health">Health & Beauty</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className='flex w-[240px]'>
          <ImageSlot path='' circle/>
        </div>
      </div>
    </div>
  )
}
