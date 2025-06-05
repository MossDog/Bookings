import React, { useState } from 'react'
import ImageSlot from '../image/ImageSlot';
//import supabase from '../../utils/supabase'; //Will be refactored alongside handleSubmit()

//NOT CURRENTLY IN USE
/* 
import GridImageSlot from '../widgets/Gallery/GridImageSlot';
import ProtectedRoute from '../ProtectedRoute'
import FormInput from '../FormInput'
 */

export type SellerCoreAccountCreationFormRef = {
  validateForm: () => boolean;
};

// Add props for formData and setFormData
interface SellerCoreAccountCreationFormProps {
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

const SellerCoreAccountCreationForm = React.forwardRef<SellerCoreAccountCreationFormRef, SellerCoreAccountCreationFormProps>(
  (props, ref) => {
    const { formData, setFormData } = props;
    const [error, setError] = useState<string | null>(null);
    //const [isLoading, setIsLoading] = useState(false); //CURRENTLY UNUSED

    React.useImperativeHandle(ref, () => ({
      validateForm: () => {
        if (!formData.name.trim() || !formData.description.trim() || !formData.address.trim() || !formData.category.trim()) {
          setError('Please fill in all fields');
          return false;
        }
        setError(null);
        return true;
      }
    }));

/* THIS NEEDS TO BE REFACTORED.
WE SHOULDN'T INSERT TO SUPABASE AT EACH STEP OF THE FORM,
RATHER ONLY WHEN THE ENTIRE STEPS PROCESS HAS BEEN VALIDATED AND COMPLETED. */
/*     const handleSubmit = async () => {
      try {
        setError(null);
        setIsLoading(true);
        console.log("HANDLING SUBMISSION")

        if (!formData.name || !formData.description || !formData.address || !formData.category) {
          throw new Error('Please fill in all fields');
        }else{
          console.log("Form Data - ", formData.name, formData.description, formData.address, formData.category)
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error('Authentication error. Please try again.');
        }

        const { error: insertError } = await supabase
          .from('Seller')
          .insert({
            user_id: sessionData.session.user.id,
            description: formData.description,
            name: formData.name,
            address: formData.address,
            category: formData.category
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
    }; */

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
            <ImageSlot path='' circle/>
          </div>
        </div>
      </div>
    )
  }
);

SellerCoreAccountCreationForm.displayName = 'SellerCoreAccountCreationForm';

export default SellerCoreAccountCreationForm;
