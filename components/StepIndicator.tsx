import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const Step: React.FC<{ step: number; label: string; currentStep: number }> = ({ step, label, currentStep }) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <div className="flex-1 flex items-center">
      <div className={`flex items-center ${isCompleted ? 'text-violet-600' : 'text-gray-500'}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${isActive ? 'bg-violet-600 text-white scale-110' : ''}
            ${isCompleted ? 'bg-violet-600 text-white' : 'bg-gray-200'}
            ${!isActive && !isCompleted ? 'text-gray-500' : ''}
          `}
        >
          {isCompleted ? <CheckIcon className="w-5 h-5"/> : step}
        </div>
        <span className="ml-3 font-semibold hidden sm:inline">{label}</span>
      </div>
      {step < 4 && (
        <div className={`flex-auto border-t-2 transition-all duration-300 mx-4 ${isCompleted ? 'border-violet-600' : 'border-gray-200'}`}></div>
      )}
    </div>
  );
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Serviço' },
    { number: 2, label: 'Profissional' },
    { number: 3, label: 'Data e Hora' },
    { number: 4, label: 'Dados' },
  ];
  // We don't show step 5 (payment) in the main indicator.

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between">
        {steps.map(s => (
          <Step key={s.number} step={s.number} label={s.label} currentStep={currentStep} />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;