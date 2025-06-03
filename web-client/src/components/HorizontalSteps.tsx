import React from "react";

interface HorizontalStepsProps {
  currentStep: number;
}

const HorizontalSteps: React.FC<HorizontalStepsProps> = ({ currentStep }) => {
  const steps = ["Register", "Choose plan", "Purchase", "Receive Product"];

  return (
    <ul className="flex justify-between items-center w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <li key={index} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              index + 1 <= currentStep
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`mt-2 text-sm ${
              index + 1 <= currentStep ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HorizontalSteps;