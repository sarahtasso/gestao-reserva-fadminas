
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Building2, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = ({ user }) => {
  // Dados simulados
  const stats = {
    totalReservations: 24,
    pendingApprovals: 3,
    activeReservations: 8,
    availableRooms: 12
  };

  const recentReservations = [
    { id: 1, location: 'Sala de Reunião A', date: '2025-01-08', time: '14:00', status: 'approved' },
    { id: 2, location: 'Auditório Principal', date: '2025-01-10', time: '09:00', status: 'pending' },
    { id: 3, location: 'Laboratório Tech', date: '2025-01-12', time: '16:00', status: 'approved' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Reunião de Planejamento', location: 'Sala A', time: '10:00' },
    { id: 2, title: 'Treinamento de Segurança', location: 'Auditório', time: '14:30' },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total de Reservas</p>
                <p className="text-3xl font-bold">{stats.totalReservations}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Aguardando Aprovação</p>
                <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Reservas Ativas</p>
                <p className="text-3xl font-bold">{stats.activeReservations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Salas Disponíveis</p>
                <p className="text-3xl font-bold">{stats.availableRooms}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Reservas Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.location}</p>
                    <p className="text-sm text-gray-600">{reservation.date} às {reservation.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {reservation.status === 'approved' ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovado
                      </span>
                    ) : (
                      <span className="flex items-center text-orange-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Próximos Eventos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <div className="text-blue-600 font-medium">
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
