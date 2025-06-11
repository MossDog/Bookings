import { useEffect, useState } from 'react'
import { z } from 'zod';
import { ProfileCreationData } from '@/utils/sellerProfileUtils';
import ImageSlot from '@/components/image/ImageSlot';
import { useUser } from '@supabase/auth-helpers-react';


// Zod schema for validation
const SellerFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  category: z.string().min(1, 'Category is required'),
});

interface SellerProfileCreationFormProps {
  onValidData: (data: ProfileCreationData) => void;
  onInvalidData: () => void;
}

function SellerProfileCreationForm ({ onValidData, onInvalidData }: SellerProfileCreationFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only validate if user exists and form data changes
    if (!user) {
      onInvalidData();
      return;
    }

    try {
      const validData = SellerFormSchema.parse(formData);
      onValidData({
        ...validData,
        user
      });
      setError(null); // Clear any previous errors
    } catch(error) {
      if(error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      onInvalidData();
    }
  }, [formData, user]); // Add all dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className='w-full h-full justify-center flex'>
      <div className='card bg-base-200 h-full w-full'>
        <div className='card-header bg-base-300/50 p-8 border-b border-base-300'>
          <h2 className='card-title text-2xl font-bold text-base-content'>Basic Info</h2>
          <p className='mt-2 text-base-content/70'>Tell us about your business to get started</p>
        </div>


        <div className='card-body p-8 space-y-6'>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Business Name</span>
            </label>
            <input 
              name='name'
              className='input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20 transition-all' 
              placeholder='Enter your business name'
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Description</span>
            </label>
            <textarea 
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='textarea textarea-bordered textarea-primary w-full min-h-[160px] focus:ring-2 focus:ring-primary/20 transition-all' 
              placeholder='Tell us about your business...'
            />
            <label className='label'>
              <span className='label-text-alt text-base-content/70'>
                Describe your services, experience, and what makes your business unique
              </span>
            </label>
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Business Address</span>
            </label>
            <input 
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              className='input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20 transition-all' 
              placeholder='Enter your business address'
            />
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Business Category</span>
            </label>
            <select 
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              className='select select-bordered select-primary w-full focus:ring-2 focus:ring-primary/20 transition-all'
            >
              <option value="" disabled>Select a category</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="health">Health & Fitness</option>
              <option value="home">Home Services</option>
              <option value="events">Events & Entertainment</option>
            </select>
          </div>

          {error && (
            <div className='alert alert-error shadow-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>




      <div className='card bg-base-200 h-full w-full'>
        <div className='card-header bg-base-200 p-8 border-b border-base-300'>
          <h2 className='card-title text-2xl font-bold text-base-content'>Add Some Images</h2>
          <p className='mt-2 text-base-content/70'>Bring your profile to life</p>
        </div>

        <div className='card-body p-8 space-y-6'>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Banner image</span>
            </label>

            <div className='w-full h-[125px]'>
              <ImageSlot bucketName='TEST' filePath='TEST'/>
            </div>
          </div>
          
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text font-medium'>Profile image</span>
            </label>

            <div className='w-full flex justify-center'>
              <div className='w-[350px] h-[350px]'>
                <ImageSlot bucketName='TEST' filePath='TEST' circle/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProfileCreationForm;
