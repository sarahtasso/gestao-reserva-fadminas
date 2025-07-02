
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, MapPin, Settings, User, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const NewReservation = ({ user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: null,
    time: '',
    duration: '',
    location: '',
    equipment: [],
    responsible: '',
    observations: ''
  });

  const locations = [
    'Sala de Reunião A', 'Sala de Reunião B', 'Auditório Principal', 
    'Laboratório Tech', 'Sala de Treinamento', 'Sala de Videoconferência'
  ];

  const equipment = [
    { id: 1, name: 'Projetor', available: true },
    { id: 2, name: 'Notebook', available: true },
    { id: 3, name: 'Microfone', available: false },
    { id: 4, name: 'Caixa de Som', available: true },
    { id: 5, name: 'Flip Chart', available: true },
    { id: 6, name: 'Mesa Redonda Extra', available: true },
  ];

  const handleEquipmentChange = (equipmentId, checked) => {
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

  const handleSubmit = () => {
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
      responsible: '',
      observations: ''
    });
    setStep(1);
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              stepNumber <= step 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-600"
            )}>
              {stepNumber}
            </div>
            {stepNumber < 6 && (
              <div className={cn(
                "w-8 h-1 mx-2",
                stepNumber < step ? "bg-blue-600" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-2xl">Nova Reserva</CardTitle>
          <p className="text-gray-600">Siga os passos para criar sua reserva</p>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepIndicator()}

          {/* Step 1: Data */}
          {step === 1 && (
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
                />
              </div>

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
          )}

          {/* Step 2: Local */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Escolha o Local</h3>
                <p className="text-gray-600">Selecione onde será realizado o evento</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <Card 
                    key={location}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      formData.location === location 
                        ? "ring-2 ring-blue-500 bg-blue-50" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => setFormData({ ...formData, location })}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium">{location}</h4>
                      <p className="text-sm text-gray-600 mt-1">Capacidade: 20 pessoas</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Equipamentos */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Equipamentos</h3>
                <p className="text-gray-600">Selecione os equipamentos necessários</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`equipment-${item.id}`}
                      checked={formData.equipment.includes(item.id)}
                      onCheckedChange={(checked) => handleEquipmentChange(item.id, checked)}
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
          )}

          {/* Step 4: Responsável */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Responsável</h3>
                <p className="text-gray-600">Informe quem será o responsável pelo evento</p>
              </div>
              
              <div>
                <Label htmlFor="responsible">Nome do Responsável</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Nome completo do responsável"
                />
              </div>
            </div>
          )}

          {/* Step 5: Observações */}
          {step === 5 && (
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
          )}

          {/* Step 6: Resumo */}
          {step === 6 && (
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
                
                <div>
                  <h4 className="font-medium text-gray-900">Responsável</h4>
                  <p className="text-gray-600">{formData.responsible || 'Não informado'}</p>
                </div>
                
                {formData.observations && (
                  <div>
                    <h4 className="font-medium text-gray-900">Observações</h4>
                    <p className="text-gray-600">{formData.observations}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={step === 1}
            >
              Anterior
            </Button>
            
            {step < 6 ? (
              <Button 
                onClick={nextStep}
                disabled={
                  (step === 1 && (!formData.date || !formData.time || !formData.duration)) ||
                  (step === 2 && !formData.location) ||
                  (step === 4 && !formData.responsible)
                }
              >
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Confirmar Reserva
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewReservation;
