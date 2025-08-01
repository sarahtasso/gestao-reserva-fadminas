import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import NewReservation from '@/components/NewReservation';
import ReservationsManager from '@/components/ReservationsManager';
import ResourcesManager from '@/components/ResourcesManager';
import UsersManager from '@/components/UsersManager';
import { Building2, Calendar, Settings, Users, BookOpen } from 'lucide-react';

interface UserProfile {
  id: string;
  nome: string;
  tipo_usuario: string;
  telefone?: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid recursion
          setTimeout(async () => {
            const { data: profile, error } = await supabase
              .from('perfis')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Erro ao buscar perfil:', error);
              toast({
                title: "Erro",
                description: "Não foi possível carregar o perfil do usuário.",
                variant: "destructive",
              });
            } else if (profile) {
              setUserProfile(profile);
            } else {
              // Perfil não encontrado, redirecionar para criação
              navigate('/auth');
            }
          }, 0);
        } else {
          setUserProfile(null);
          navigate('/auth');
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    navigate('/auth');
    return null;
  }

  const isAdmin = userProfile.tipo_usuario === 'admin_equipamento' || userProfile.tipo_usuario === 'super_admin';

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
              <span className="text-sm text-gray-600">Olá, {userProfile.nome}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {userProfile.tipo_usuario === 'super_admin' ? 'Super Admin' : 
                 userProfile.tipo_usuario === 'admin_equipamento' ? 'Admin Equipamento' : 'Usuário'}
              </span>
              <button
                onClick={handleLogout}
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
