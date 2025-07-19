import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import type { FormData } from '@/hooks/useReservationForm';

interface ObservationsStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const ObservationsStep = ({ formData, setFormData }: ObservationsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Observações</h3>
        <p className="text-gray-600">Adicione informações adicionais se necessário</p>
      </div>
      
      <div>
        <Label htmlFor="observations">Observações (opcional)</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          placeholder="Informações adicionais sobre o evento, configuração especial, etc."
          rows={4}
        />
      </div>
    </div>
  );
};