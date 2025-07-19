import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import type { FormData } from '@/hooks/useReservationForm';

interface DateTimeStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isDateUnavailable: (date: Date) => boolean;
}

export const DateTimeStep = ({ formData, setFormData, isDateUnavailable }: DateTimeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CalendarIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Selecione a Data</h3>
        <p className="text-gray-600">Escolha quando você precisa do recurso</p>
      </div>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={formData.date}
          onSelect={(date) => setFormData({ ...formData, date })}
          disabled={(date) => date < new Date()}
          className="rounded-md border"
          modifiers={{
            unavailable: isDateUnavailable
          }}
          modifiersStyles={{
            unavailable: { backgroundColor: '#fee2e2', color: '#dc2626' }
          }}
        />
      </div>

      {formData.date && isDateUnavailable(formData.date) && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-red-800 text-sm">
            Esta data possui reservas existentes. Verifique a disponibilidade do horário desejado.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duração (horas)</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, duration: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hora</SelectItem>
              <SelectItem value="2">2 horas</SelectItem>
              <SelectItem value="4">4 horas</SelectItem>
              <SelectItem value="8">Dia todo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};