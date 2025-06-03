import React, { useState } from "react";
import HorizontalSteps from "../components/HorizontalSteps"; // Adjust the path based on your file structure
import SellerCoreAccountCreationForm from "../components/account-creation/SellerCoreAccountCreationForm";
import GalleryWidget from "../components/widgets/Gallery/GalleryWidget";

const AccountCreationPage: React.FC = () => {

  return (
    <div className="">

      <HorizontalSteps steps={["Basic Info", "Availability", "Add Images"]} >
        <SellerCoreAccountCreationForm />
        <div>
          TODO: Availability settings
        </div>
        <GalleryWidget />
      </HorizontalSteps>
    </div>
  );
};

export default AccountCreationPage;