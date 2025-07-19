import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepIndicator = ({ currentStep, totalSteps = 6 }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              stepNumber <= currentStep 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-600"
            )}>
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={cn(
                "w-8 h-1 mx-2",
                stepNumber < currentStep ? "bg-blue-600" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};