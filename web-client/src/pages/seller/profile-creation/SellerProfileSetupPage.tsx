import { useState } from "react";
import HorizontalSteps from "../../../components/HorizontalSteps";
import SellerProfileCreationForm from "../../../components/seller/profile-creation/SellerProfileCreationForm";
import Navbar from "@/components/Navbar";
import { createSellerProfile, ProfileCreationData } from "@/utils/sellerProfileUtils";
import { useUser } from '@supabase/auth-helpers-react'
import SellerServicesSetup from "@/components/seller/profile-creation/SellerServicesSetup";
import { Service } from "@/types/types";
import SellerOpeningHours, { WeekSchedule } from "@/components/seller/profile-creation/SellerOpeningHours";

function SellerProfileSetupPage() {
  const user = useUser();
  const [profileData, setProfileData] = useState<ProfileCreationData>();
  const [services, setServices] = useState<Service[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>();

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
    <div className="min-h-screen bg-base-100/50 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 flex flex-col py-8 h-full grow">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">Create Your Business Profile</h1>
            <p className="text-base-content/70 text-lg">
              Set up your business presence and start accepting bookings
            </p>
          </div>
        </div>

        {/* Steps Content */}
        <div className="bg-base-100 rounded-xl flex flex-col shadow-sm border border-base-200 grow h-full">
          <HorizontalSteps 
            steps={["Basic Info", "Services", "Bookings", "Add Images", "Confirm"]}
            validateStep={validateStep}  
          >
            <div className="w-full h-full max-w-[1200px] mx-auto p-6">
              <SellerProfileCreationForm
                onInvalidData={handleInvalidFormData}
                onValidData={handleValidFormData}
              />
            </div>
            <div className="w-full h-full max-w-[1200px] mx-auto p-6">
              <SellerServicesSetup 
                onNewService={handleNewService}
              />
            </div>
            <div className="w-full h-full max-w-[1200px] mx-auto p-6 ">
              <SellerOpeningHours />
            </div>
            <div className="w-full max-w-[1200px] mx-auto p-6">
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-3">Add Business Photos</h3>
                  <p className="text-base-content/70 max-w-xl mx-auto">
                    Coming soon - you'll be able to showcase your business with a photo gallery.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[1200px] mx-auto p-6">
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">Ready to Launch Your Business?</h3>
                  <p className="text-base-content/70 mb-6 max-w-xl mx-auto">
                    Review your information and click below to create your business profile.
                  </p>
                  <button 
                    onClick={onSubmit} 
                    className="btn btn-primary btn-lg"
                  >
                    Create Business Profile
                  </button>
                </div>
              </div>
            </div>
          </HorizontalSteps>
        </div>
      </main>
    </div>
  );
};

export default SellerProfileSetupPage;