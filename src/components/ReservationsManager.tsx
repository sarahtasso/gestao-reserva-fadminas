
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ReservationsManager = ({ user }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockReservations = [
    {
      id: 1,
      date: '2025-01-08',
      time: '14:00',
      duration: '2h',
      location: 'Sala de Reunião A',
      responsible: 'Ana Silva',
      requester: 'João Santos',
      equipment: ['Projetor', 'Notebook'],
      status: 'approved',
      observations: 'Reunião de planejamento mensal'
    },
    {
      id: 2,
      date: '2025-01-10',
      time: '09:00',
      duration: '4h',
      location: 'Auditório Principal',
      responsible: 'Maria Costa',
      requester: 'Pedro Lima',
      equipment: ['Microfone', 'Caixa de Som', 'Projetor'],
      status: 'pending',
      observations: 'Palestra sobre inovação'
    },
    {
      id: 3,
      date: '2025-01-05',
      time: '16:00',
      duration: '1h',
      location: 'Laboratório Tech',
      responsible: 'Carlos Oliveira',
      requester: 'Maria Silva',
      equipment: [],
      status: 'rejected',
      observations: 'Conflito de horário'
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      approved: { variant: 'default', className: 'bg-green-500 hover:bg-green-600', text: 'Aprovado' },
      pending: { variant: 'secondary', className: 'bg-orange-500 hover:bg-orange-600 text-white', text: 'Pendente' },
      rejected: { variant: 'destructive', text: 'Rejeitado' }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const filteredReservations = mockReservations.filter(reservation => {
    const matchesFilter = filter === 'all' || reservation.status === filter;
    const matchesSearch = reservation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por local ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as reservas</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="grid gap-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{reservation.location}</h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {reservation.date} às {reservation.time} ({reservation.duration})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Responsável</p>
                    <p className="font-medium">{reservation.responsible}</p>
                    <p className="text-sm text-gray-600 mt-1">Solicitante: {reservation.requester}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Equipamentos</p>
                    <p className="text-sm">
                      {reservation.equipment.length > 0 
                        ? reservation.equipment.join(', ')
                        : 'Nenhum equipamento'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusBadge(reservation.status)}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Reserva</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Local</h4>
                          <p className="text-gray-600">{reservation.location}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Data e Horário</h4>
                          <p className="text-gray-600">{reservation.date} às {reservation.time} ({reservation.duration})</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Responsável</h4>
                          <p className="text-gray-600">{reservation.responsible}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Solicitante</h4>
                          <p className="text-gray-600">{reservation.requester}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Equipamentos</h4>
                          <p className="text-gray-600">
                            {reservation.equipment.length > 0 
                              ? reservation.equipment.join(', ')
                              : 'Nenhum equipamento'
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Status</h4>
                          {getStatusBadge(reservation.status)}
                        </div>
                        {reservation.observations && (
                          <div>
                            <h4 className="font-medium">Observações</h4>
                            <p className="text-gray-600">{reservation.observations}</p>
                          </div>
                        )}
                      </div>
                      
                      {user.role === 'admin' || user.role === 'super_admin' ? (
                        <div className="flex space-x-2 mt-6">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button variant="destructive" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                        </div>
                      ) : null}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou criar uma nova reserva.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReservationsManager;
