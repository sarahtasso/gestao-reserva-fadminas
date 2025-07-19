import { Button } from '@/components/ui/button';
import type { FormData } from '@/hooks/useReservationForm';

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  formData: FormData;
  isDecorationSelected: () => boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const FormNavigation = ({
  step,
  totalSteps,
  formData,
  isDecorationSelected,
  onPrevious,
  onNext,
  onSubmit
}: FormNavigationProps) => {
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.date && formData.time && formData.duration;
      case 2:
        return formData.location;
      case 3:
        return !isDecorationSelected() || formData.decorationDetails.trim();
      case 4:
        return formData.responsible && formData.department;
      default:
        return true;
    }
  };

  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={step === 1}
      >
        Anterior
      </Button>
      
      {step < totalSteps ? (
        <Button 
          onClick={onNext}
          disabled={!isStepValid()}
        >
          Próximo
        </Button>
      ) : (
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
          Confirmar Reserva
        </Button>
      )}
    </div>
  );
};