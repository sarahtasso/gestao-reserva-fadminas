import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { FormData } from '@/hooks/useReservationForm';

interface SummaryStepProps {
  formData: FormData;
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

export const SummaryStep = ({ formData }: SummaryStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Revisar e Confirmar</h3>
        <p className="text-gray-600">Verifique todos os dados antes de enviar</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">Data e Horário</h4>
          <p className="text-gray-600">
            {formData.date ? format(formData.date, 'dd/MM/yyyy') : 'Não selecionado'} às {formData.time} ({formData.duration}h)
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">Local</h4>
          <p className="text-gray-600">{formData.location || 'Não selecionado'}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">Equipamentos</h4>
          <p className="text-gray-600">
            {formData.equipment.length > 0 
              ? equipment.filter(e => formData.equipment.includes(e.id)).map(e => e.name).join(', ')
              : 'Nenhum equipamento selecionado'
            }
          </p>
        </div>
        
        {formData.additionals.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Adicionais</h4>
            <p className="text-gray-600">
              {additionals.filter(a => formData.additionals.includes(a.id)).map(a => a.name).join(', ')}
            </p>
          </div>
        )}

        {formData.decorationDetails && (
          <div>
            <h4 className="font-medium text-gray-900">Detalhamento da Decoração</h4>
            <p className="text-gray-600">{formData.decorationDetails}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-gray-900">Responsável</h4>
          <p className="text-gray-600">{formData.responsible || 'Não informado'}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">Departamento</h4>
          <p className="text-gray-600">{formData.department || 'Não informado'}</p>
        </div>
        
        {formData.observations && (
          <div>
            <h4 className="font-medium text-gray-900">Observações</h4>
            <p className="text-gray-600">{formData.observations}</p>
          </div>
        )}
      </div>
    </div>
  );
};