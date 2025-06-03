import React, { useState } from "react";
import HorizontalSteps from "../components/HorizontalSteps"; // Adjust the path based on your file structure
import SellerCoreAccountCreationForm from "../components/account-creation/SellerCoreAccountCreationForm";

const AccountCreationPage: React.FC = () => {

  return (
    <div className="">

      <HorizontalSteps steps={["Register", "Choose Plan", "Purchase", "Receive Product"]} >
        <SellerCoreAccountCreationForm />

      </HorizontalSteps>
    </div>
  );
};

export default AccountCreationPage;