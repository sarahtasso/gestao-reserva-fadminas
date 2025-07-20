
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // SECURITY WARNING: This is a development mock only
  // For production, implement proper authentication with Supabase
  const mockUsers = [
    { id: 1, email: 'admin@empresa.com', password: 'demo123', name: 'Admin Sistema', role: 'super_admin' },
    { id: 2, email: 'gerente@empresa.com', password: 'demo123', name: 'Maria Silva', role: 'admin' },
    { id: 3, email: 'usuario@empresa.com', password: 'demo123', name: 'João Santos', role: 'user' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Input validation and sanitization
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      toast({
        title: "Erro no login",
        description: "Email inválido",
        variant: "destructive",
      });
      return;
    }
    
    // Rate limiting simulation (in production, implement server-side)
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt) < 1000) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde antes de tentar novamente",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('lastLoginAttempt', now.toString());
    
    const user = mockUsers.find(u => u.email === sanitizedEmail && u.password === sanitizedPassword);
    
    if (user) {
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.name}`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Controle Interno</h1>
          <p className="text-gray-600">Gerenciamento de recursos corporativos</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p className="font-medium">Usuários de demonstração:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Super Admin:</strong> admin@empresa.com / demo123</p>
                <p><strong>Admin:</strong> gerente@empresa.com / demo123</p>
                <p><strong>Usuário:</strong> usuario@empresa.com / demo123</p>
              </div>
              <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Demo apenas - Para produção, implemente autenticação real com Supabase
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
