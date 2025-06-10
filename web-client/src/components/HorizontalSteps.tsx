import React, { useState } from "react";

interface HorizontalStepsProps {
  steps: string[];
  children: React.ReactNode;
  validateStep?: (stepIdx: number) => boolean;
}

const HorizontalSteps: React.FC<HorizontalStepsProps> = ({ steps, children, validateStep }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (validateStep && !validateStep(currentStep - 1)) {
      return;
    }
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
    <div className="flex flex-col justify-between items-center p-6 space-y-6 bg-base-100 w-screen grow">
    <div className="relative w-full max-w-4xl mx-auto px-6 py-8">
      {/* Steps */}
      <ul className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isActive = index + 1 === currentStep;

          return (
            <li
              key={index}
              className={`flex flex-col items-center text-center ${
                isActive ? "text-primary" : "text-base-content/60"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-bold text-lg transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 border-blue-600 text-white dark:bg-base-300 dark:border-blue-950 dark:text-blue-950"
                    : isActive
                    ? "bg-blue-100 border-blue-600 text-blue-600 dark:bg-base-100 dark:border-blue-600 dark:text-blue-600"
                    : "bg-gray-100 border-gray-300 text-gray-500 dark:bg-base-100 dark:border-blue-900 dark:text-blue-900"
                }`}
              >
                {index + 1}
              </div>
              {/* Step Label */}
              <span
                className={`mt-2 text-md font-bold ${
                  isCompleted
                  ? "text-gray-500 dark:text-blue-950"
                  : isActive
                  ? "text-blue-600 dark:text-blue-600"
                  : "text-gray-500 dark:text-blue-900"
                }`}
              >
                {step}
              </span>
              {/* Current Step Indicator */}
              {isActive && (
                <span className="mt-1 text-xs text-primary font-semibold">
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
    <div className="w-full flex items-center justify-center">
        {React.Children.toArray(children)[currentStep - 1]}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded ${
            currentStep === 1
              ? "bg-base-200 text-base-content/40 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className={`px-4 py-2 rounded ${
            currentStep === totalSteps
              ? "bg-base-200 text-base-content/40 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HorizontalSteps;