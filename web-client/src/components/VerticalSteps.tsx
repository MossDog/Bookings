import React, { useState } from "react";

interface HorizontalStepsProps {
  steps: string[];
  children: React.ReactNode;
  validateStep?: (stepIdx: number) => boolean;
}

const HorizontalSteps: React.FC<HorizontalStepsProps> = ({
  steps,
  children,
  validateStep,
}) => {
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
    <div className="flex h-full w-full grow bg-base-100">
      {/* Left sidebar with steps */}
      <div className="w-64 min-h-full flex flex-col justify-between p-8 border-r border-base-200">
        <ul className="flex flex-col space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isActive = index + 1 === currentStep;

            return (
              <li
                key={index}
                className={`flex items-center space-x-4 ${
                  isActive ? "text-primary" : "text-base-content/60"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary border-primary-focus text-primary-content"
                      : isActive
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-base-200 border-base-300 text-base-content/60"
                  }`}
                >
                  {index + 1}
                </div>
                {/* Step Label */}
                <span
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-base-content/60"
                      : isActive
                        ? "text-primary"
                        : "text-base-content/60"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Navigation buttons */}
        <div className="border-t border-base-300 py-3">
          <div className="max-w-3xl mx-auto flex justify-center gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`btn btn-primary ${
                currentStep === 1 ? "btn-disabled" : ""
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className={`btn btn-primary ${
                currentStep === totalSteps ? "btn-disabled" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-start flex-col">
        {React.Children.toArray(children)[currentStep - 1]}
      </div>
    </div>
  );
};

export default HorizontalSteps;
