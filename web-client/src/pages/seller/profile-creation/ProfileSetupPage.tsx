import React, { useRef, useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm, { SellerProfileCreationFormRef } from "../../../components/seller/profile-creation/SellerProfileCreationForm";


const ProfileSetupPage: React.FC = () => {
  const sellerFormRef = useRef<SellerProfileCreationFormRef>(null);

  // LIFTED STATE: Store form data in parent so it persists between steps
  const [sellerFormData, setSellerFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: ''
  });

  // Handler to be passed to HorizontalSteps for validation
  const validateStep = (stepIdx: number) => {
    if (stepIdx === 0 && sellerFormRef.current) {
      return sellerFormRef.current.validateForm();
    }
    return true;
  };

  return (
    <div className="">
      <HorizontalSteps steps={["Basic Info", "Availability", "Add Images"]} validateStep={validateStep}>
        <SellerProfileCreationForm
          ref={sellerFormRef}
          formData={sellerFormData}
          setFormData={setSellerFormData}
        />
      </HorizontalSteps>
    </div>
  );
};

export default ProfileSetupPage;