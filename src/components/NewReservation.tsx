import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, MapPin, Settings, User, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
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
    additionals: [],
    responsible: '',
    department: '',
    observations: '',
    decorationDetails: ''
  });

  const locations = [
    { name: 'Igreja', capacity: 1000 },
    { name: 'Auditório Sergio Cidadão', capacity: 150 },
    { name: 'Refeitório', capacity: 300 },
    { name: 'IDEC', capacity: 200 }
  ];

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

  const handleAdditionalChange = (additionalId, checked) => {
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

  const isDecorationSelected = () => {
    return formData.additionals.includes(12);
  };

  const handleSubmit = () => {
    if (checkConflict()) {
      toast({
        title: "Conflito detectado!",
        description: "Este local já está reservado no horário selecionado. Escolha outro horário ou local.",
        variant: "destructive",
      });
      return;
    }

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

  const isDateUnavailable = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return existingReservations.some(reservation => reservation.date === dateStr);
  };

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
          )}

          {/* Step 3: Equipamentos */}
          {step === 3 && (
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

                {/* Adicionais */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Adicionais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionals.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={`additional-${item.id}`}
                          checked={formData.additionals.includes(item.id)}
                          onCheckedChange={(checked) => handleAdditionalChange(item.id, checked)}
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
          )}

          {/* Step 4: Responsável e Departamento */}
          {step === 4 && (
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
                  (step === 3 && isDecorationSelected() && !formData.decorationDetails.trim()) ||
                  (step === 4 && (!formData.responsible || !formData.department))
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
