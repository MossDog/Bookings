import React, { useEffect, useRef, useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm from "../../../components/seller/profile-creation/SellerProfileCreationForm";
import Navbar from "@/components/Navbar";
import { ProfileCreationData } from "@/utils/sellerProfileUtils";
import { useUser } from '@supabase/auth-helpers-react'

function SellerProfileSetupPage() {
  const user = useUser();
  const [profileData, setProfileData] = useState<ProfileCreationData>();
  const [isFormValid, setIsFormValid] = useState(false);

  const handleValidFormData = (data: ProfileCreationData) => {
    setProfileData(data);
    setIsFormValid(true);
  }

  const handleInvalidFormData = () => {
    setIsFormValid(false);
  }

  const validateStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      return isFormValid;
    }
    
    return true;
  };

  const onSubmit = async () => {
    
  }


  return (
    <div className="min-h-screen overflow flex flex-col">
      <Navbar />
      <HorizontalSteps 
        steps={["Basic Info", "Availability", "Add Images"]}
        validateStep={validateStep}  
      >
        <SellerProfileCreationForm
          onInvalidData={handleInvalidFormData}
          onValidData={handleValidFormData}
        />
        <div>TODO: Availability</div>
        <button className="btn" onClick={onSubmit}>Confirm Account Creation</button>
      </HorizontalSteps>
    </div>
  );
};

export default SellerProfileSetupPage;