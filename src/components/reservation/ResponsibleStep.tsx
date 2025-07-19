import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import type { FormData } from '@/hooks/useReservationForm';

interface ResponsibleStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const ResponsibleStep = ({ formData, setFormData }: ResponsibleStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Responsável</h3>
        <p className="text-gray-600">Informe quem será o responsável pelo evento</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="responsible">Nome do Responsável</Label>
          <Input
            id="responsible"
            value={formData.responsible}
            onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
            placeholder="Nome completo do responsável"
          />
        </div>
        
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Departamento responsável pelo evento"
          />
        </div>
      </div>
    </div>
  );
};