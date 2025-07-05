import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import NewReservation from '@/components/NewReservation';
import ReservationsManager from '@/components/ReservationsManager';
import ResourcesManager from '@/components/ResourcesManager';
import UsersManager from '@/components/UsersManager';
import { Building2, Calendar, Settings, Users, BookOpen } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Controle Interno</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {user.role === 'admin' ? 'Admin' : user.role === 'super_admin' ? 'Super Admin' : 'Usuário'}
              </span>
              <button
                onClick={() => setUser(null)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="new-reservation" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Nova Reserva</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Reservas</span>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="resources" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Recursos</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Usuários</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              user={user} 
              setActiveTab={setActiveTab}
              setSelectedDate={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="new-reservation">
            <NewReservation 
              user={user} 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationsManager user={user} />
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="resources">
                <ResourcesManager user={user} />
              </TabsContent>

              <TabsContent value="users">
                <UsersManager user={user} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
