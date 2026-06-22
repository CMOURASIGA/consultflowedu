import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { PlusCircle, Building, Users, Activity } from 'lucide-react';

const initialDepartments = [
  { id: 1, name: 'Secretaria Escolar', members: 5, activeTickets: 24, avgTime: '2.5h' },
  { id: 2, name: 'Setor Financeiro', members: 3, activeTickets: 18, avgTime: '4.2h' },
  { id: 3, name: 'Coordenação Pedagógica', members: 6, activeTickets: 12, avgTime: '1.8h' },
  { id: 4, name: 'Suporte de TI', members: 2, activeTickets: 5, avgTime: '1.0h' },
];

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    let savedDepts = JSON.parse(localStorage.getItem('departments') || '[]');
    if (savedDepts.length === 0) {
      savedDepts = initialDepartments;
      localStorage.setItem('departments', JSON.stringify(savedDepts));
    }
    setDepartments(savedDepts);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Setores</h1>
          <p className="text-sm text-muted mt-1">Gerencie as áreas de atendimento e equipes.</p>
        </div>
        <Button className="gap-2" onClick={() => {
          const newName = prompt('Nome do novo setor:');
          if (newName) {
            const newDept = {
              id: Date.now(),
              name: newName,
              members: 0,
              activeTickets: 0,
              avgTime: '0h'
            };
            const updated = [...departments, newDept];
            setDepartments(updated);
            localStorage.setItem('departments', JSON.stringify(updated));
          }
        }}>
          <PlusCircle className="w-4 h-4" />
          Novo Setor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Building className="w-6 h-6" />
                </div>
                <Button variant="ghost" size="sm" className="text-muted hover:text-text h-8 px-2">
                  Editar
                </Button>
              </div>
              <h3 className="text-lg font-bold text-text truncate">{dept.name}</h3>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted gap-2"><Users className="w-4 h-4" /> Membros na equipe</span>
                  <span className="font-semibold">{dept.members}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted gap-2"><Activity className="w-4 h-4" /> Demandas Abertas</span>
                  <span className="font-semibold text-danger">{dept.activeTickets}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted gap-2"><Activity className="w-4 h-4" /> Tempo Médio</span>
                  <span className="font-semibold">{dept.avgTime}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <Button variant="outline" className="w-full text-sm h-9">Ver Equipe</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
