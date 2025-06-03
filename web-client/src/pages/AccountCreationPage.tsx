import React, { useState } from "react";
import HorizontalSteps from "../components/HorizontalSteps"; // Adjust the path based on your file structure

const AccountCreationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Total number of milestones

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-white min-h-screen">

      <HorizontalSteps currentStep={currentStep} />
      <div className="w-full max-w-lg">
        {currentStep && (
          <div className="text-center">
<p className="text-gray-800 text-lg">Step {currentStep} content goes here.</p>          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded ${
            currentStep === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className={`px-4 py-2 rounded ${
            currentStep === totalSteps
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountCreationPage;