import React, { useRef, useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm, { SellerProfileCreationFormRef } from "../../../components/seller/profile-creation/SellerProfileCreationForm";
import supabase from "../../../utils/supabase";
import { getUser } from "../../../utils/authUtils";


const SellerProfileSetupPage: React.FC = () => {
  const sellerFormRef = useRef<SellerProfileCreationFormRef>(null);

  // LIFTED STATE: Store form data in parent so it persists between steps
  const [sellerFormData, setSellerFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: ''
  });

  // TODO: Refactor to separate file
  const onSubmit = async () => {
    const user = await getUser();

    if(!user){
      console.error("No user found creating account");
      return;
    }

    const { error } = await supabase.from('Seller').insert({
      ...sellerFormData,
      user_id: user.id,
      availability: {}
    });

    if(error){
      console.error(error);
    }
  }

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
        <div>TODO: Availability</div>
        <button className="btn" onClick={onSubmit}>Confirm Account Creation</button>
      </HorizontalSteps>
    </div>
  );
};

export default SellerProfileSetupPage;