import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReservationForm } from '@/hooks/useReservationForm';
import { StepIndicator } from '@/components/reservation/StepIndicator';
import { DateTimeStep } from '@/components/reservation/DateTimeStep';
import { LocationStep } from '@/components/reservation/LocationStep';
import { EquipmentStep } from '@/components/reservation/EquipmentStep';
import { ResponsibleStep } from '@/components/reservation/ResponsibleStep';
import { ObservationsStep } from '@/components/reservation/ObservationsStep';
import { SummaryStep } from '@/components/reservation/SummaryStep';
import { FormNavigation } from '@/components/reservation/FormNavigation';

interface NewReservationProps {
  user: any;
  selectedDate?: Date | null;
  setSelectedDate?: (date: Date | null) => void;
}

const NewReservation = ({ user, selectedDate, setSelectedDate }: NewReservationProps) => {
  const {
    step,
    formData,
    setFormData,
    isDateUnavailable,
    isDecorationSelected,
    handleSubmit,
    nextStep,
    prevStep
  } = useReservationForm(selectedDate, setSelectedDate);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <DateTimeStep
            formData={formData}
            setFormData={setFormData}
            isDateUnavailable={isDateUnavailable}
          />
        );
      case 2:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <EquipmentStep
            formData={formData}
            setFormData={setFormData}
            isDecorationSelected={isDecorationSelected}
          />
        );
      case 4:
        return (
          <ResponsibleStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <ObservationsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 6:
        return <SummaryStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-2xl">Nova Reserva</CardTitle>
          <p className="text-gray-600">Siga os passos para criar sua reserva</p>
        </CardHeader>
        <CardContent className="p-6">
          <StepIndicator currentStep={step} />
          {renderStepContent()}
          <FormNavigation
            step={step}
            totalSteps={6}
            formData={formData}
            isDecorationSelected={isDecorationSelected}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewReservation;
