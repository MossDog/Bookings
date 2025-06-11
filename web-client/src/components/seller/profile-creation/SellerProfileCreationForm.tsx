import { useState } from 'react'
import { z } from 'zod';
import { ProfileCreationData } from '@/utils/sellerProfileUtils';


// Zod schema for validation
const SellerFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  category: z.string().min(1, 'Category is required'),
});

interface SellerProfileCreationFormProps {
  onValidData: () => void;
}

function SellerProfileCreationForm () {
  const [profileData, setProfileData] = useState<ProfileCreationData>();
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div className='card bg-primary w-full max-w-2xl mx-auto shadow-xl'>
      <div className='card-header p-6 border-b border-base-300'>
        <h2 className='card-title text-2xl font-bold'>Basic Info</h2>
      </div>

      <div className='card-body p-6 space-y-4'>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Business Name</span>
          </label>
          <input 
            className='input input-primary w-full' 
            placeholder='Enter your business name'
          />
        </div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Description</span>
          </label>
          <textarea 
            className='textarea textarea-primary w-full min-h-[120px]' 
            placeholder='Tell us about your business...'
          />
        </div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Business Address</span>
          </label>
          <input 
            className='input input-primary w-full' 
            placeholder='Enter your business address'
          />
        </div>
      </div>
    </div>
  )
}

export default SellerProfileCreationForm;
