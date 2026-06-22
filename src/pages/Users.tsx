import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { PlusCircle, Search, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const initialUsers: User[] = [
  { id: '1', name: 'Admin Flow', email: 'admin@consultflow.com.br', role: 'Administrador', status: 'active' },
  { id: '2', name: 'Maria Souza', email: 'maria@escola.com.br', role: 'Secretaria', status: 'active' },
  { id: '3', name: 'João Silva', email: 'joao@escola.com.br', role: 'Professor', status: 'active' },
  { id: '4', name: 'Carlos Santos', email: 'carlos@escola.com.br', role: 'Financeiro', status: 'inactive' },
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    let savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (savedUsers.length === 0) {
      savedUsers = initialUsers;
      localStorage.setItem('users', JSON.stringify(savedUsers));
    }
    setUsers(savedUsers);
  }, []);

  const saveToStorage = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({});

  const handleCreateNew = () => {
    setIsAdding(true);
    setFormData({ name: '', email: '', role: 'Professor', status: 'active' });
  };

  const handleSave = () => {
    if (isAdding) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || '',
        email: formData.email || '',
        role: formData.role || '',
        status: (formData.status as 'active' | 'inactive') || 'active'
      };
      saveToStorage([...users, newUser]);
      setIsAdding(false);
    } else if (isEditing) {
      saveToStorage(users.map(u => u.id === isEditing.id ? { ...u, ...formData } as User : u));
      setIsEditing(null);
    }
  };

  const handleDelete = (id: string) => {
    saveToStorage(users.filter(u => u.id !== id));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Gestão de Usuários</h1>
          <p className="text-sm text-muted mt-1">Gerencie os acessos ao sistema e permissões.</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {(isAdding || isEditing) && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-text mb-4">
              {isAdding ? 'Novo Usuário' : 'Editar Usuário'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Nome do usuário"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="email@exemplo.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Perfil / Cargo</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Professor">Professor</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Coordenador">Coordenador</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-muted uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nome e E-mail</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{user.name}</div>
                    <div className="text-muted text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.status === 'active' ? (
                        <><CheckCircle className="w-4 h-4 text-success" /> <span className="text-success font-medium">Ativo</span></>
                      ) : (
                        <><XCircle className="w-4 h-4 text-muted" /> <span className="text-muted font-medium">Inativo</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-primary hover:bg-primary/10"
                      onClick={() => { setIsEditing(user); setFormData(user); setIsAdding(false); }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-danger hover:bg-danger/10"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
