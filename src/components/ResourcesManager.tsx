
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, Settings, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const ResourcesManager = ({ user }) => {
  const [activeTab, setActiveTab] = useState('locations');
  
  const [locations, setLocations] = useState([
    { id: 1, name: 'Igreja', capacity: 1000, available: true },
    { id: 2, name: 'Auditório Sergio Cidadão', capacity: 150, available: true },
    { id: 3, name: 'Refeitório', capacity: 300, available: true },
    { id: 4, name: 'IDEC', capacity: 200, available: false },
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Computador', category: 'Equipamentos', available: true },
    { id: 2, name: 'Telão/Projetor/TV', category: 'Equipamentos', available: true },
    { id: 3, name: 'Mesa de Som', category: 'Equipamentos', available: true },
    { id: 4, name: 'Caixa de Som', category: 'Equipamentos', available: true },
    { id: 5, name: 'Microfone', category: 'Equipamentos', available: false },
    { id: 6, name: 'Câmeras de gravação', category: 'Equipamentos', available: true },
    { id: 7, name: 'Mídia (celular)', category: 'Equipamentos', available: true },
    { id: 8, name: 'Iluminação', category: 'Equipamentos', available: true },
    { id: 9, name: 'Passador', category: 'Adicionais', available: true },
    { id: 10, name: 'Lapela', category: 'Adicionais', available: true },
    { id: 11, name: 'Rádio', category: 'Adicionais', available: true },
    { id: 12, name: 'Decoração', category: 'Adicionais', available: true },
  ]);

  const [newLocation, setNewLocation] = useState({ name: '', capacity: '' });
  const [newEquipment, setNewEquipment] = useState({ name: '', category: 'Equipamentos' });

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.capacity) {
      const id = Math.max(...locations.map(l => l.id)) + 1;
      setLocations([...locations, {
        id,
        name: newLocation.name,
        capacity: parseInt(newLocation.capacity),
        available: true
      }]);
      setNewLocation({ name: '', capacity: '' });
      toast({
        title: "Local adicionado com sucesso!",
        description: `${newLocation.name} foi adicionado à lista de locais.`,
      });
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.category) {
      const id = Math.max(...equipment.map(e => e.id)) + 1;
      setEquipment([...equipment, {
        id,
        name: newEquipment.name,
        category: newEquipment.category,
        available: true
      }]);
      setNewEquipment({ name: '', category: 'Equipamentos' });
      toast({
        title: "Equipamento adicionado com sucesso!",
        description: `${newEquipment.name} foi adicionado à lista de equipamentos.`,
      });
    }
  };

  const toggleLocationAvailability = (id) => {
    setLocations(locations.map(location => 
      location.id === id 
        ? { ...location, available: !location.available }
        : location
    ));
  };

  const toggleEquipmentAvailability = (id) => {
    setEquipment(equipment.map(item => 
      item.id === id 
        ? { ...item, available: !item.available }
        : item
    ));
  };

  const removeLocation = (id) => {
    setLocations(locations.filter(location => location.id !== id));
    toast({
      title: "Local removido",
      description: "O local foi removido com sucesso.",
    });
  };

  const removeEquipment = (id) => {
    setEquipment(equipment.filter(item => item.id !== id));
    toast({
      title: "Equipamento removido",
      description: "O equipamento foi removido com sucesso.",
    });
  };

  const equipmentsByCategory = {
    'Equipamentos': equipment.filter(item => item.category === 'Equipamentos'),
    'Adicionais': equipment.filter(item => item.category === 'Adicionais')
  };

  return (
    <div className="space-y-6">
      {/* Navegação por abas */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'locations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4 inline mr-2" />
          Locais
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'equipment'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Equipamentos
        </button>
      </div>

      {/* Gerenciamento de Locais */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Gerenciar Locais</span>
              </CardTitle>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Local
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Local</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location-name">Nome do Local</Label>
                      <Input
                        id="location-name"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                        placeholder="Ex: Sala de Reunião C"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location-capacity">Capacidade</Label>
                      <Input
                        id="location-capacity"
                        type="number"
                        value={newLocation.capacity}
                        onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                        placeholder="Número de pessoas"
                      />
                    </div>
                    <Button onClick={handleAddLocation} className="w-full">
                      Adicionar Local
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-gray-600">Capacidade: {location.capacity} pessoas</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={location.available ? 'default' : 'secondary'}>
                        {location.available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                      <Switch
                        checked={location.available}
                        onCheckedChange={() => toggleLocationAvailability(location.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gerenciamento de Equipamentos */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Gerenciar Equipamentos</span>
              </CardTitle>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Equipamento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="equipment-name">Nome do Equipamento</Label>
                      <Input
                        id="equipment-name"
                        value={newEquipment.name}
                        onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                        placeholder="Ex: Webcam HD"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipment-category">Categoria</Label>
                      <select
                        id="equipment-category"
                        value={newEquipment.category}
                        onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Adicionais">Adicionais</option>
                      </select>
                    </div>
                    <Button onClick={handleAddEquipment} className="w-full">
                      Adicionar Equipamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(equipmentsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-medium text-lg mb-3 text-gray-900">{category}</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">Categoria: {item.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={item.available ? 'default' : 'secondary'}>
                              {item.available ? 'Disponível' : 'Em manutenção'}
                            </Badge>
                            <Switch
                              checked={item.available}
                              onCheckedChange={() => toggleEquipmentAvailability(item.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEquipment(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesManager;
