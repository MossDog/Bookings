import React, { useEffect, useRef, useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm from "../../../components/seller/profile-creation/SellerProfileCreationForm";
import Navbar from "@/components/Navbar";
import { ProfileCreationData } from "@/utils/sellerProfileUtils";
import { useUser } from '@supabase/auth-helpers-react'

function SellerProfileSetupPage() {
  const user = useUser();
  const [ profileData, setProfileData ] = useState<ProfileCreationData>();

  const onSubmit = async () => {
    
  }


  return (
    <div className="min-h-screen overflow flex flex-col">
      <Navbar />
      <HorizontalSteps steps={["Basic Info", "Availability", "Add Images"]}>
        <SellerProfileCreationForm

        />
        <div>TODO: Availability</div>
        <button className="btn" onClick={onSubmit}>Confirm Account Creation</button>
      </HorizontalSteps>
    </div>
  );
};

export default SellerProfileSetupPage;