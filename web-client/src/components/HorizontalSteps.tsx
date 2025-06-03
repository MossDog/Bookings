import React from "react";

interface HorizontalStepsProps {
  currentStep: number;
}

const HorizontalSteps: React.FC<HorizontalStepsProps> = ({ currentStep }) => {
  const steps = ["Register", "Choose Plan", "Purchase", "Receive Product"];

  return (
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
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-bold text-lg transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isActive
                    ? "bg-blue-100 border-blue-600 text-blue-600"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {/* Step Label */}
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive ? "font-bold text-blue-600" : "text-gray-500"
                }`}
              >
                {step}
              </span>
              {/* Current Step Indicator */}
              {isActive && (
                <span className="mt-1 text-xs text-blue-500 font-semibold">
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HorizontalSteps;