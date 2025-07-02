
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const ResourcesManager = ({ user }) => {
  const [activeTab, setActiveTab] = useState('locations');
  
  const [locations, setLocations] = useState([
    { id: 1, name: 'Sala de Reunião A', capacity: 10, available: true },
    { id: 2, name: 'Sala de Reunião B', capacity: 8, available: true },
    { id: 3, name: 'Auditório Principal', capacity: 100, available: true },
    { id: 4, name: 'Laboratório Tech', capacity: 15, available: false },
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Projetor', category: 'Audiovisual', available: true },
    { id: 2, name: 'Notebook', category: 'Informática', available: true },
    { id: 3, name: 'Microfone', category: 'Audiovisual', available: false },
    { id: 4, name: 'Caixa de Som', category: 'Audiovisual', available: true },
  ]);

  const [newLocation, setNewLocation] = useState({ name: '', capacity: '' });
  const [newEquipment, setNewEquipment] = useState({ name: '', category: '' });

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
      setNewEquipment({ name: '', category: '' });
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
                      <Input
                        id="equipment-category"
                        value={newEquipment.category}
                        onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                        placeholder="Ex: Audiovisual, Informática"
                      />
                    </div>
                    <Button onClick={handleAddEquipment} className="w-full">
                      Adicionar Equipamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesManager;
