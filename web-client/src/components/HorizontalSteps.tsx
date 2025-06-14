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
    <div className="flex flex-col lg:flex-row min-h-full w-full">
      {/* Steps sidebar */}
      <div className="w-full lg:w-72 bg-base-100/50 border-b lg:border-b-0 lg:border-r border-base-200">
        <div className="sticky top-0 flex flex-col justify-between h-full">
          {/* Steps list */}
          <div className="p-6">
            <h4 className="text-sm font-medium text-base-content/70 mb-6">Setup Progress</h4>
            <ul className="steps steps-vertical gap-2">
              {steps.map((step, index) => {
                const isCompleted = index + 1 < currentStep;
                const isActive = index + 1 === currentStep;

                return (
                  <li
                    key={index}
                    className={`w-full min-h-[3rem] flex items-center gap-3 rounded-lg transition-colors
                      ${isActive ? 'bg-primary/10' : 'hover:bg-base-200/50'}
                      ${isCompleted ? 'text-base-content' : 'text-base-content/70'}
                      p-2
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCompleted ? 'bg-primary text-primary-content' : 
                        isActive ? 'bg-primary text-primary-content' : 
                        'bg-base-200 text-base-content/70'}
                    `}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm font-medium flex-1
                      ${isActive ? 'text-primary font-semibold' : ''}
                    `}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-base-200">
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn flex-1 btn-outline btn-neutral"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === totalSteps}
                className="btn flex-1 btn-primary"
              >
                {currentStep === totalSteps ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 bg-base-100/50">
        <div className="w-full h-full">
          {React.Children.toArray(children)[currentStep - 1]}
        </div>
      </div>
    </div>
  );
};

export default HorizontalSteps;