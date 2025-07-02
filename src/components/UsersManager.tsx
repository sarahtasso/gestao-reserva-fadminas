
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const UsersManager = ({ user }) => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Admin Sistema', 
      email: 'admin@empresa.com', 
      role: 'super_admin', 
      department: 'TI',
      phone: '(11) 99999-9999',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Maria Silva', 
      email: 'gerente@empresa.com', 
      role: 'admin', 
      department: 'Recursos Humanos',
      phone: '(11) 88888-8888',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'João Santos', 
      email: 'usuario@empresa.com', 
      role: 'user', 
      department: 'Marketing',
      phone: '(11) 77777-7777',
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Ana Costa', 
      email: 'ana@empresa.com', 
      role: 'user', 
      department: 'Vendas',
      phone: '(11) 66666-6666',
      status: 'inactive'
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    phone: ''
  });

  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.department) {
      const id = Math.max(...users.map(u => u.id)) + 1;
      setUsers([...users, {
        ...newUser,
        id,
        status: 'active'
      }]);
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        department: '',
        phone: ''
      });
      toast({
        title: "Usuário adicionado com sucesso!",
        description: `${newUser.name} foi adicionado ao sistema.`,
      });
    }
  };

  const handleEditUser = (userData) => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
    setEditingUser(null);
    toast({
      title: "Usuário atualizado!",
      description: "As informações do usuário foram atualizadas.",
    });
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido do sistema.",
    });
  };

  const getRoleBadge = (role) => {
    const roles = {
      super_admin: { variant: 'default', className: 'bg-purple-500 hover:bg-purple-600', text: 'Super Admin' },
      admin: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600', text: 'Admin' },
      user: { variant: 'secondary', text: 'Usuário' }
    };
    
    const config = roles[role];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gerenciar Usuários</span>
          </CardTitle>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-name">Nome Completo</Label>
                  <Input
                    id="user-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Nome completo do usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="user-role">Função</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {user.role === 'super_admin' && (
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="user-department">Departamento</Label>
                  <Input
                    id="user-department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="Ex: Marketing, TI, RH"
                  />
                </div>
                <div>
                  <Label htmlFor="user-phone">Telefone</Label>
                  <Input
                    id="user-phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <Button onClick={handleAddUser} className="w-full">
                  Adicionar Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userItem) => (
              <Card key={userItem.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-lg">{userItem.name}</h3>
                        {getRoleBadge(userItem.role)}
                        {getStatusBadge(userItem.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {userItem.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {userItem.phone}
                        </div>
                        <div>
                          <strong>Depto:</strong> {userItem.department}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(userItem.id)}
                      >
                        {userItem.status === 'active' ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(userItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                          </DialogHeader>
                          {editingUser && (
                            <div className="space-y-4">
                              <div>
                                <Label>Nome Completo</Label>
                                <Input
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Função</Label>
                                <Select 
                                  value={editingUser.role} 
                                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">Usuário</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {user.role === 'super_admin' && (
                                      <SelectItem value="super_admin">Super Admin</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Departamento</Label>
                                <Input
                                  value={editingUser.department}
                                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Telefone</Label>
                                <Input
                                  value={editingUser.phone}
                                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                />
                              </div>
                              <Button onClick={() => handleEditUser(editingUser)} className="w-full">
                                Salvar Alterações
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeUser(userItem.id)}
                        disabled={userItem.id === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManager;
