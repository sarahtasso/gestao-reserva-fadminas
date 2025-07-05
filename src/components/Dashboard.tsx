import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, Settings, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Dashboard = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [selectedStatsType, setSelectedStatsType] = useState('');
  const { toast } = useToast();

  // Dados simulados expandidos
  const stats = {
    totalReservations: 24,
    pendingApprovals: 3,
    activeReservations: 8
  };

  // Reservas mockadas para diferentes datas
  const mockReservations = {
    '2025-01-08': [
      { id: 1, title: 'Culto Matutino', location: 'Igreja', time: '09:00', responsible: 'Pastor Silva', status: 'approved' },
      { id: 2, title: 'Reunião da Diretoria', location: 'Auditório Sergio Cidadão', time: '14:00', responsible: 'Maria Santos', status: 'approved' }
    ],
    '2025-01-10': [
      { id: 3, title: 'Jantar Beneficente', location: 'Refeitório', time: '19:00', responsible: 'João Costa', status: 'pending' }
    ],
    '2025-01-12': [
      { id: 4, title: 'Palestra sobre Sustentabilidade', location: 'IDEC', time: '16:00', responsible: 'Ana Oliveira', status: 'approved' },
      { id: 5, title: 'Ensaio do Coral', location: 'Igreja', time: '20:00', responsible: 'Carlos Music', status: 'approved' }
    ],
    '2025-01-15': [
      { id: 6, title: 'Treinamento de Primeiros Socorros', location: 'Auditório Sergio Cidadão', time: '08:00', responsible: 'Dra. Paula', status: 'approved' }
    ]
  };

  // Dados detalhados para os pop-ups dos cards
  const [reservationsData, setReservationsData] = useState({
    total: [
      { id: 1, title: 'Culto Matutino', location: 'Igreja', date: '08/01/2025', time: '09:00', status: 'approved' },
      { id: 2, title: 'Reunião da Diretoria', location: 'Auditório Sergio Cidadão', date: '08/01/2025', time: '14:00', status: 'approved' },
      { id: 3, title: 'Jantar Beneficente', location: 'Refeitório', date: '10/01/2025', time: '19:00', status: 'pending' },
      { id: 4, title: 'Palestra sobre Sustentabilidade', location: 'IDEC', date: '12/01/2025', time: '16:00', status: 'approved' },
      { id: 5, title: 'Ensaio do Coral', location: 'Igreja', date: '12/01/2025', time: '20:00', status: 'approved' },
      { id: 6, title: 'Treinamento de Primeiros Socorros', location: 'Auditório Sergio Cidadão', date: '15/01/2025', time: '08:00', status: 'approved' },
      { id: 7, title: 'Reunião de Planejamento', location: 'IDEC', date: '18/01/2025', time: '10:00', status: 'rejected' },
      { id: 8, title: 'Workshop de Liderança', location: 'Refeitório', date: '20/01/2025', time: '15:00', status: 'pending' }
    ],
    pending: [
      { id: 3, title: 'Jantar Beneficente', location: 'Refeitório', date: '10/01/2025', time: '19:00', status: 'pending', responsible: 'João Costa' },
      { id: 8, title: 'Workshop de Liderança', location: 'Refeitório', date: '20/01/2025', time: '15:00', status: 'pending', responsible: 'Ana Silva' },
      { id: 9, title: 'Apresentação Cultural', location: 'Igreja', date: '25/01/2025', time: '17:00', status: 'pending', responsible: 'Pedro Santos' }
    ],
    active: [
      { id: 1, title: 'Culto Matutino', location: 'Igreja', date: '08/01/2025', time: '09:00', status: 'approved' },
      { id: 2, title: 'Reunião da Diretoria', location: 'Auditório Sergio Cidadão', date: '08/01/2025', time: '14:00', status: 'approved' },
      { id: 4, title: 'Palestra sobre Sustentabilidade', location: 'IDEC', date: '12/01/2025', time: '16:00', status: 'approved' },
      { id: 5, title: 'Ensaio do Coral', location: 'Igreja', date: '12/01/2025', time: '20:00', status: 'approved' },
      { id: 6, title: 'Treinamento de Primeiros Socorros', location: 'Auditório Sergio Cidadão', date: '15/01/2025', time: '08:00', status: 'approved' }
    ]
  });

  const recentReservations = [
    { id: 1, location: 'Igreja', date: '2025-01-08', time: '09:00', status: 'approved' },
    { id: 2, location: 'Auditório Sergio Cidadão', date: '2025-01-10', time: '14:00', status: 'pending' },
    { id: 3, location: 'IDEC', date: '2025-01-12', time: '16:00', status: 'approved' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Culto Matutino', location: 'Igreja', date: '08/01/2025', time: '09:00' },
    { id: 2, title: 'Reunião da Diretoria', location: 'Auditório Sergio Cidadão', date: '10/01/2025', time: '14:00' },
    { id: 3, title: 'Palestra sobre Sustentabilidade', location: 'IDEC', date: '12/01/2025', time: '16:00' },
  ];

  // Função auxiliar para determinar o tipo de reservas de um dia
  const getReservationTypes = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayReservations = mockReservations[dateKey] || [];
    
    const hasActive = dayReservations.some(res => res.status === 'approved');
    const hasPending = dayReservations.some(res => res.status === 'pending');
    
    return { hasActive, hasPending };
  };

  // Função para obter a classe CSS baseada no tipo de reservas
  const getCalendarDayClass = (day) => {
    const { hasActive, hasPending } = getReservationTypes(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    if (isToday) {
      return "bg-blue-600 text-white hover:bg-blue-700";
    }
    
    if (hasActive && hasPending) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium"; // Ambos: azul
    } else if (hasActive) {
      return "bg-green-100 text-green-800 hover:bg-green-200 font-medium"; // Apenas ativas: verde
    } else if (hasPending) {
      return "bg-orange-100 text-orange-800 hover:bg-orange-200 font-medium"; // Apenas pendentes: laranja
    }
    
    return "hover:bg-gray-100"; // Sem reservas
  };

  // Funções do calendário
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasReservations = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return mockReservations[dateKey] && mockReservations[dateKey].length > 0;
  };

  const handleDateClick = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayReservations = mockReservations[dateKey] || [];
    
    setSelectedDate({ 
      day, 
      reservations: dayReservations,
      dateKey,
      fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    });
    setShowReservationsModal(true);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleCreateReservation = () => {
    setShowReservationsModal(false);
    setShowNewReservationModal(true);
  };

  // Função para renderizar o calendário
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Cabeçalho com os dias da semana
    const header = dayNames.map(day => (
      <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
        {day}
      </div>
    ));

    // Dias vazios no início do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClass = getCalendarDayClass(day);
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            "p-2 text-center text-sm cursor-pointer rounded-lg transition-colors",
            dayClass
          )}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {header}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  // Função para abrir modal dos cards estatísticos
  const handleStatsCardClick = (type) => {
    setSelectedStatsType(type);
    setShowStatsModal(true);
  };

  // Função para aprovar reserva
  const handleApproveReservation = (reservationId) => {
    setReservationsData(prev => ({
      ...prev,
      pending: prev.pending.map(res => 
        res.id === reservationId ? { ...res, status: 'approved' } : res
      ).filter(res => res.status === 'pending'),
      total: prev.total.map(res => 
        res.id === reservationId ? { ...res, status: 'approved' } : res
      ),
      active: [...prev.active, prev.pending.find(res => res.id === reservationId && { ...res, status: 'approved' })].filter(Boolean)
    }));

    toast({
      title: "Reserva Aprovada",
      description: "A reserva foi aprovada com sucesso!",
    });
  };

  // Função para rejeitar reserva
  const handleRejectReservation = (reservationId) => {
    setReservationsData(prev => ({
      ...prev,
      pending: prev.pending.filter(res => res.id !== reservationId),
      total: prev.total.map(res => 
        res.id === reservationId ? { ...res, status: 'rejected' } : res
      )
    }));

    toast({
      title: "Reserva Rejeitada",
      description: "A reserva foi rejeitada.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aprovado</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Pendente</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejeitado</span>;
      default:
        return null;
    }
  };

  const renderStatsModal = () => {
    let title = '';
    let data = [];

    switch (selectedStatsType) {
      case 'total':
        title = 'Total de Reservas';
        data = reservationsData.total;
        break;
      case 'pending':
        title = 'Aguardando Aprovação';
        data = reservationsData.pending;
        break;
      case 'active':
        title = 'Reservas Ativas';
        data = reservationsData.active;
        break;
      default:
        return null;
    }

    return (
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                  {selectedStatsType === 'pending' && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    {selectedStatsType === 'pending' && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveReservation(item.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectReservation(item.id)}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
          onClick={() => handleStatsCardClick('total')}
        >
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

        <Card 
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
          onClick={() => handleStatsCardClick('pending')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Aguardando Aprovação</p>
                <p className="text-3xl font-bold">{reservationsData.pending.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 cursor-pointer hover:from-green-600 hover:to-green-700 transition-all"
          onClick={() => handleStatsCardClick('active')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Reservas Ativas</p>
                <p className="text-3xl font-bold">{reservationsData.active.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário Mensal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Calendário de Reservas</span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderCalendar()}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
                <span>Reservas Ativas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded-full"></div>
                <span>Reservas Pendentes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div>
                <span>Ativas e Pendentes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Hoje</span>
              </div>
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
                <div key={event.id} className="flex flex-col p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <div className="text-blue-600 font-medium text-sm">
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Modal de Reservas do Dia */}
      <Dialog open={showReservationsModal} onOpenChange={setShowReservationsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.day}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Botão para criar nova reserva */}
            <Button 
              onClick={handleCreateReservation}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Reserva para este dia</span>
            </Button>

            {/* Reservas existentes */}
            {selectedDate?.reservations && selectedDate.reservations.length > 0 && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Reservas existentes:</h4>
                  <div className="space-y-3">
                    {selectedDate.reservations.map((reservation) => (
                      <div key={reservation.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{reservation.title}</p>
                            <p className="text-sm text-gray-600">{reservation.location}</p>
                            <p className="text-sm text-gray-500">Responsável: {reservation.responsible}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-blue-600">{reservation.time}</p>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              reservation.status === 'approved' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-orange-100 text-orange-800"
                            )}>
                              {reservation.status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedDate?.reservations && selectedDate.reservations.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhuma reserva para este dia.</p>
                <p className="text-sm">Clique no botão acima para criar uma nova reserva.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Nova Reserva */}
      <Dialog open={showNewReservationModal} onOpenChange={setShowNewReservationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Nova Reserva - {selectedDate?.day}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-800 font-medium">Funcionalidade em desenvolvimento</p>
              <p className="text-blue-600 text-sm mt-1">
                Para criar uma nova reserva, use a aba "Nova Reserva" no menu principal.
              </p>
            </div>
            <Button 
              onClick={() => setShowNewReservationModal(false)}
              className="w-full"
              variant="outline"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Estatísticas */}
      {renderStatsModal()}
    </div>
  );
};

export default Dashboard;
