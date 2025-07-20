import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export interface FormData {
  date: Date | null;
  time: string;
  duration: string;
  location: string;
  equipment: number[];
  additionals: number[];
  responsible: string;
  department: string;
  observations: string;
  decorationDetails: string;
}

export const useReservationForm = (selectedDate?: Date | null, setSelectedDate?: (date: Date | null) => void) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    date: null,
    time: '',
    duration: '',
    location: '',
    equipment: [],
    additionals: [],
    responsible: '',
    department: '',
    observations: '',
    decorationDetails: ''
  });

  // Effect to set the date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate
      }));
    }
  }, [selectedDate]);

  // Simulação de reservas existentes para detecção de conflitos
  const existingReservations = [
    { location: 'Igreja', date: '2025-01-08', time: '09:00', duration: '2' },
    { location: 'Auditório Sergio Cidadão', date: '2025-01-10', time: '14:00', duration: '4' },
    { location: 'IDEC', date: '2025-01-12', time: '16:00', duration: '2' },
  ];

  const checkConflict = () => {
    if (!formData.date || !formData.time || !formData.location || !formData.duration) {
      return false;
    }

    const selectedDate = format(formData.date, 'yyyy-MM-dd');
    const selectedTime = parseInt(formData.time.split(':')[0]);
    const selectedDuration = parseInt(formData.duration);

    for (const reservation of existingReservations) {
      if (
        reservation.location === formData.location &&
        reservation.date === selectedDate
      ) {
        const existingTime = parseInt(reservation.time.split(':')[0]);
        const existingDuration = parseInt(reservation.duration);
        
        // Verifica sobreposição de horários
        if (
          (selectedTime >= existingTime && selectedTime < existingTime + existingDuration) ||
          (selectedTime + selectedDuration > existingTime && selectedTime < existingTime + existingDuration)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return existingReservations.some(reservation => reservation.date === dateStr);
  };

  const isDecorationSelected = () => {
    return formData.additionals.includes(12);
  };

  // Input validation helper
  const validateInput = (value: string, type: 'text' | 'number' | 'email' = 'text') => {
    if (!value || value.trim().length === 0) return false;
    
    // Sanitize input - remove potentially dangerous characters
    const sanitized = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                          .replace(/[<>]/g, '');
    
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
      case 'number':
        return /^\d+$/.test(sanitized);
      case 'text':
        return sanitized.length >= 2 && sanitized.length <= 1000;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    // Comprehensive validation before submission
    if (!formData.date || !formData.time || !formData.duration || !formData.location) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Validate text inputs
    if (!validateInput(formData.responsible) || !validateInput(formData.department)) {
      toast({
        title: "Dados inválidos",
        description: "Verifique os campos de responsável e departamento.",
        variant: "destructive",
      });
      return;
    }

    // Validate observations if provided
    if (formData.observations && formData.observations.trim().length > 2000) {
      toast({
        title: "Observações muito longas",
        description: "As observações devem ter no máximo 2000 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (checkConflict()) {
      toast({
        title: "Conflito detectado!",
        description: "Este local já está reservado no horário selecionado. Escolha outro horário ou local.",
        variant: "destructive",
      });
      return;
    }

    // Sanitize all form data before submission
    const sanitizedData = {
      ...formData,
      responsible: formData.responsible.trim(),
      department: formData.department.trim(),
      observations: formData.observations.trim(),
      decorationDetails: formData.decorationDetails.trim()
    };

    toast({
      title: "Reserva solicitada com sucesso!",
      description: "Sua reserva será analisada pela equipe responsável.",
    });
    
    // Reset form
    setFormData({
      date: null,
      time: '',
      duration: '',
      location: '',
      equipment: [],
      additionals: [],
      responsible: '',
      department: '',
      observations: '',
      decorationDetails: ''
    });
    setStep(1);
    
    // Clear selected date in parent component
    if (setSelectedDate) {
      setSelectedDate(null);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (checkConflict()) {
        toast({
          title: "Conflito detectado!",
          description: "Este local já está reservado no horário selecionado. Escolha outro horário ou local.",
          variant: "destructive",
        });
        return;
      }
    }
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return {
    step,
    formData,
    setFormData,
    checkConflict,
    isDateUnavailable,
    isDecorationSelected,
    handleSubmit,
    nextStep,
    prevStep,
    existingReservations
  };
};