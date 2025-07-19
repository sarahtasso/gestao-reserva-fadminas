import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormData } from '@/hooks/useReservationForm';

interface EquipmentStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isDecorationSelected: () => boolean;
}

const equipment = [
  { id: 1, name: 'Computador', available: true },
  { id: 2, name: 'Telão/Projetor/TV', available: true },
  { id: 3, name: 'Mesa de Som', available: true },
  { id: 4, name: 'Caixa de Som', available: true },
  { id: 5, name: 'Microfone', available: false },
  { id: 6, name: 'Câmeras de gravação', available: true },
  { id: 7, name: 'Mídia (celular)', available: true },
  { id: 8, name: 'Iluminação', available: true },
];

const additionals = [
  { id: 9, name: 'Passador', available: true },
  { id: 10, name: 'Lapela', available: true },
  { id: 11, name: 'Rádio', available: true },
  { id: 12, name: 'Decoração', available: true },
];

export const EquipmentStep = ({ formData, setFormData, isDecorationSelected }: EquipmentStepProps) => {
  const handleEquipmentChange = (equipmentId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, equipmentId]
      });
    } else {
      setFormData({
        ...formData,
        equipment: formData.equipment.filter(id => id !== equipmentId)
      });
    }
  };

  const handleAdditionalChange = (additionalId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        additionals: [...formData.additionals, additionalId]
      });
    } else {
      setFormData({
        ...formData,
        additionals: formData.additionals.filter(id => id !== additionalId),
        // Limpar detalhes da decoração se não estiver mais selecionada
        decorationDetails: additionalId === 12 ? '' : formData.decorationDetails
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Equipamentos e Recursos</h3>
        <p className="text-gray-600">Selecione os recursos necessários</p>
      </div>
      
      <div className="space-y-6">
        {/* Equipamentos Principais */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Equipamentos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`equipment-${item.id}`}
                  checked={formData.equipment.includes(item.id)}
                  onCheckedChange={(checked) => handleEquipmentChange(item.id, checked as boolean)}
                  disabled={!item.available}
                />
                <Label 
                  htmlFor={`equipment-${item.id}`}
                  className={cn(
                    "flex-1",
                    item.available ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {item.name}
                  {!item.available && <span className="text-red-500 text-sm ml-2">(Indisponível)</span>}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Adicionais */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Adicionais</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {additionals.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`additional-${item.id}`}
                  checked={formData.additionals.includes(item.id)}
                  onCheckedChange={(checked) => handleAdditionalChange(item.id, checked as boolean)}
                  disabled={!item.available}
                />
                <Label 
                  htmlFor={`additional-${item.id}`}
                  className={cn(
                    "flex-1",
                    item.available ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {item.name}
                  {!item.available && <span className="text-red-500 text-sm ml-2">(Indisponível)</span>}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Campo adicional para detalhes da decoração */}
        {isDecorationSelected() && (
          <div className="mt-6">
            <Label htmlFor="decorationDetails" className="text-red-600">
              Detalhamento da Decoração *
            </Label>
            <Textarea
              id="decorationDetails"
              value={formData.decorationDetails}
              onChange={(e) => setFormData({ ...formData, decorationDetails: e.target.value })}
              placeholder="Descreva detalhadamente como deverá ser a decoração (cores, estilo, elementos específicos, etc.)"
              rows={3}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              Campo obrigatório quando decoração for selecionada
            </p>
          </div>
        )}
      </div>
    </div>
  );
};