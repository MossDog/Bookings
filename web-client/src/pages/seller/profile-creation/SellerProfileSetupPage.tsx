import { useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm from "../../../components/seller/profile-creation/SellerProfileCreationForm";
import Navbar from "@/components/Navbar";
import { createSellerProfile, ProfileCreationData } from "@/utils/sellerProfileUtils";
import { useUser } from '@supabase/auth-helpers-react'
import SellerServicesSetup from "@/components/seller/profile-creation/SellerServicesSetup";
import { Service } from "@/types/types";

function SellerProfileSetupPage() {
  const user = useUser();
  const [profileData, setProfileData] = useState<ProfileCreationData>();
  const [services, setServices] = useState<Service[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleValidFormData = (data: ProfileCreationData) => {
    setProfileData(data);
    setIsFormValid(true);
  }

  const handleInvalidFormData = () => {
    setIsFormValid(false);
  }

  const handleNewService = (service: Service) => {
    setServices([
      ...services,
      service
    ])
  }

  const validateStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      return isFormValid;
    }
    
    return true;
  };

  const onSubmit = async () => {
    if (!user || !profileData) {
      return;
    }

    // Destructure the required fields to ensure they exist
    const { name, description, address, category } = profileData;

    // Check if all required fields are present
    if (!name || !description || !address || !category) {
      return;
    }

    try {
      const { success } = await createSellerProfile({
        ...profileData,
        services
      });

      if(success){
        console.log("Business profile successfully created!");
      } else {
        throw new Error("Error creating business");
      }
    } catch (error){
      console.error(error);
    }
  }


  return (
    <div className="min-h-screen overflow flex flex-col">
      <Navbar />
      <HorizontalSteps 
        steps={["Basic Info", "Services", "Bookings", "Add Images", "Confirm"]}
        validateStep={validateStep}  
      >
        <SellerProfileCreationForm
          onInvalidData={handleInvalidFormData}
          onValidData={handleValidFormData}
        />
        <SellerServicesSetup 
          onNewService={handleNewService}
        />
        <div>TODO: Availability</div>
        <div>TODO: Gallery maybe? </div>
        <button className="btn" onClick={onSubmit}>Confirm Account Creation</button>
      </HorizontalSteps>
    </div>
  );
};

export default SellerProfileSetupPage;