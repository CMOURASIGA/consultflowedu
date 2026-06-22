import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Filter, Plus } from "lucide-react";

export function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    if (savedTickets.length === 0) {
      savedTickets = [
        {
          id: '1001', protocol: 'PRT-849201', requester_name: 'Maria Clara', department_name: 'Secretaria', priority: 'alta', status: 'em_atendimento', created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '1002', protocol: 'PRT-128302', requester_name: 'João Silva', department_name: 'Financeiro', priority: 'media', status: 'novo', created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem('tickets', JSON.stringify(savedTickets));
    }
    
    setTickets(savedTickets);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo': return <Badge variant="new">Novo</Badge>;
      case 'em_analise': return <Badge variant="in_analysis">Em análise</Badge>;
      case 'em_atendimento': return <Badge variant="default">Em atendimento</Badge>;
      case 'aguardando_solicitante': return <Badge variant="waiting">Aguardando Solicitante</Badge>;
      case 'resolvido': return <Badge variant="success">Resolvido</Badge>;
      case 'cancelado': return <Badge variant="outline">Cancelado</Badge>;
      case 'reaberto': return <Badge variant="reopened">Reaberto</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (!priority) return <Badge variant="outline">N/A</Badge>;
    switch (priority.toLowerCase()) {
      case 'baixa': return <Badge variant="outline">Baixa</Badge>;
      case 'media': return <Badge variant="secondary">Média</Badge>;
      case 'alta': return <Badge variant="warning">Alta</Badge>;
      case 'urgente': return <Badge variant="danger">Urgente</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Demandas</h1>
          <p className="text-muted">Gerencie as solicitações da instituição.</p>
        </div>
        <Link to="/app/tickets/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Demanda
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="border-b border-border p-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <Input placeholder="Buscar por protocolo..." className="pl-9" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background text-muted uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Protocolo / Data</th>
                  <th className="px-6 py-4 font-semibold">Solicitante</th>
                  <th className="px-6 py-4 font-semibold">Setor</th>
                  <th className="px-6 py-4 font-semibold">Prioridade</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted">Carregando...</td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted">Ainda não há demandas.</td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">{t.protocol}</div>
                        <div className="text-xs text-muted">{new Date(t.created_at).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{t.requester_name || 'Desconhecido'}</div>
                      </td>
                      <td className="px-6 py-4">{t.department_name || '-'}</td>
                      <td className="px-6 py-4">{getPriorityBadge(t.priority)}</td>
                      <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/app/tickets/${t.id}`}>
                          <Button variant="secondary" size="sm">Detalhes</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
