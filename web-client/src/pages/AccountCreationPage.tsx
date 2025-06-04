import React, { useRef, useState } from "react";
import HorizontalSteps from "../components/HorizontalSteps";
import SellerCoreAccountCreationForm, { SellerCoreAccountCreationFormRef } from "../components/account-creation/SellerCoreAccountCreationForm";
import GalleryWidget from "../components/widgets/Gallery/GalleryWidget";

const AccountCreationPage: React.FC = () => {
  const sellerFormRef = useRef<SellerCoreAccountCreationFormRef>(null);

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
        <SellerCoreAccountCreationForm
          ref={sellerFormRef}
          formData={sellerFormData}
          setFormData={setSellerFormData}
        />
        <div>
          TODO: Availability settings
        </div>
        <GalleryWidget />
      </HorizontalSteps>
    </div>
  );
};

export default AccountCreationPage;