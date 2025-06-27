import { updateAboutUs } from '@/utils/seller';
import { Info } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface EditAboutProps {
  sellerId?: string;
  initialAboutUs?: string;
  onSave?: (aboutUs: string) => void;
  isLoading?: boolean;
}

export default function EditAbout({ 
  initialAboutUs = "",
  onSave,
  isLoading = false,
  sellerId
}: EditAboutProps) {
  const [aboutUs, setAboutUs] = useState(initialAboutUs);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setAboutUs(newValue);
    setHasChanges(newValue !== initialAboutUs);
  };

  const handleSave = async () => {
    if(!sellerId) return;

    const success = await updateAboutUs(sellerId, aboutUs);

    if(success) {
      if (onSave) {
        onSave(aboutUs);
      }

      setHasChanges(false);
      toast.success("Successfully updated About section");
    } else {
      toast.error("Update failed. Please try again.");
    }

    
  };

  const handleReset = () => {
    setAboutUs(initialAboutUs);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">About Us Section</h3>
        <p className="text-sm text-base-content/70 mb-4">
          Tell customers about your business, services, and what makes you special.
        </p>
      </div>

      <div className="form-control flex-col flex">
        <label className="label">
          <span className="label-text font-medium">About Us Content</span>
          <span className="label-text-alt text-base-content/50">
            {aboutUs.length}/500 characters
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-50 min-w-4xl resize-none"
          placeholder="Write about your business, services, history, team, or anything that helps customers understand who you are..."
          value={aboutUs}
          onChange={handleTextChange}
          maxLength={500}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/50">
            This will be displayed on your public business page
          </span>
        </label>
      </div>

      

      
        <div className="h-15">
          { hasChanges && 
            <div className='alert alert-primary'>
              <Info /><span>You have unsaved changes to your about us section.</span>
            </div> }
        </div>
      

      <div className="flex gap-3 justify-end">
        <button 
          className="btn btn-ghost"
          onClick={handleReset}
          disabled={!hasChanges || isLoading}
        >
          Reset
        </button>
        <button 
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
