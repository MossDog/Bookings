import React, { useState } from 'react'
import { z } from 'zod';


export type SellerProfileCreationFormRef = {
  validateForm: () => boolean;
};

// Add props for formData and setFormData
interface SellerProfileCreationFormProps {
  formData: {
    name: string;
    description: string;
    address: string;
    category: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    address: string;
    category: string;
  }>>;
}

// Zod schema for validation
const SellerFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  category: z.string().min(1, 'Category is required'),
});

const SellerProfileCreationForm = React.forwardRef<SellerProfileCreationFormRef, SellerProfileCreationFormProps>(
  (props, ref) => {
    const { formData, setFormData } = props;
    const [error, setError] = useState<string | null>(null);

    React.useImperativeHandle(ref, () => ({
      validateForm: () => {
        const result = SellerFormSchema.safeParse(formData);
        if (!result.success) {
          setError(result.error.errors[0]?.message || 'Please fill in all fields');
          return false;
        }
        setError(null);
        return true;
      }
    }));

    return (
      <div className="flex flex-col gap-3 min-w-[480px]">
        <h1 className='text-2xl font-bold'>Basic Info</h1>
        {/* Error message for validation failure */}
        {error && (
          <div className="alert alert-error text-red-600 bg-red-100 border border-red-400 rounded p-2 mb-2">
            {error}
          </div>
        )}
        <div className='flex gap-2'>
          <div className='flex flex-col gap-3 min-w-[480px]'>
            <div className="form-control w-full">
              <input
                type="text"
                placeholder="Enter business name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="form-control w-full">
              <textarea
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe your business"
                value={formData.description}
                onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="form-control w-full">
              <input
                type="text"
                placeholder="Enter business address"
                className="input input-bordered w-full"
                value={formData.address}
                onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="form-control w-full">
              <select
                className="select select-bordered w-full"
                value={formData.category}
                onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                title="Select a category"
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
            {/* <ImageSlot path='' circle/> */}
          </div>
        </div>
      </div>
    )
  }
);

SellerProfileCreationForm.displayName = 'SellerProfileCreationForm';

export default SellerProfileCreationForm;
