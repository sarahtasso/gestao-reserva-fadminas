import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormData } from '@/hooks/useReservationForm';

interface LocationStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const locations = [
  { name: 'Igreja', capacity: 1000 },
  { name: 'Auditório Sergio Cidadão', capacity: 150 },
  { name: 'Refeitório', capacity: 300 },
  { name: 'IDEC', capacity: 200 }
];

export const LocationStep = ({ formData, setFormData }: LocationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Escolha o Local</h3>
        <p className="text-gray-600">Selecione onde será realizado o evento</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.name}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              formData.location === location.name 
                ? "ring-2 ring-blue-500 bg-blue-50" 
                : "hover:bg-gray-50"
            )}
            onClick={() => setFormData({ ...formData, location: location.name })}
          >
            <CardContent className="p-4 text-center">
              <h4 className="font-medium">{location.name}</h4>
              <p className="text-sm text-gray-600 mt-1">Capacidade: {location.capacity} pessoas</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};