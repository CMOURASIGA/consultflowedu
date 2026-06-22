import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    delayed: 0,
    resolved: 0,
    averageTime: "0h"
  });

  useEffect(() => {
    // Read from local storage
    const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setStats({
      total: savedTickets.length,
      delayed: savedTickets.filter((t: any) => t.status === 'atrasado').length || 0,
      resolved: savedTickets.filter((t: any) => t.status === 'resolvido').length || 0,
      averageTime: "24h" // Mock string for now
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Visão Geral</h1>
        <p className="text-sm text-muted mt-1">Status atual do atendimento escolar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="text-muted text-xs font-semibold uppercase tracking-wide">Demandas Abertas</div>
          <div className="text-3xl font-bold text-text mt-1">{stats.total - stats.resolved}</div>
          <div className="text-success text-xs font-medium mt-2">↑ 12% vs mês anterior</div>
        </Card>

        <Card className="p-5">
          <div className="text-muted text-xs font-semibold uppercase tracking-wide">Demandas em Atraso</div>
          <div className="text-3xl font-bold text-text mt-1">{stats.delayed}</div>
          <div className="text-danger text-xs font-medium mt-2">Prioridade de atenção</div>
        </Card>

        <Card className="p-5">
          <div className="text-muted text-xs font-semibold uppercase tracking-wide">Resolvidas no Período</div>
          <div className="text-3xl font-bold text-text mt-1">{stats.resolved}</div>
          <div className="text-success text-xs font-medium mt-2">↑ 8% em andamento</div>
        </Card>

        <Card className="p-5">
          <div className="text-muted text-xs font-semibold uppercase tracking-wide">Tempo Médio (Resposta)</div>
          <div className="text-3xl font-bold text-text mt-1">{stats.averageTime}</div>
          <div className="text-primary text-xs font-medium mt-2">Estável nas últimas 24h</div>
        </Card>
      </div>
      
      {/* Charts placeholders */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 flex-1">
        <Card className="col-span-2 flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-text">Volume por Setor</h3>
            <select className="text-xs bg-background border-border rounded-md px-2 py-1 outline-none">
              <option>Últimos 7 dias</option>
            </select>
          </div>
          <div className="p-6 flex-1 flex items-end gap-4 px-10 pb-8 min-h-[300px]">
            {/* Simple mock chart to mimic the Sleek Interface */}
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/10 rounded-t-lg relative h-40">
                  <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{height: `${[65, 45, 85, 70, 95][i]}%`}}></div>
                </div>
                <span className="text-[10px] text-muted font-bold uppercase">{day}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="col-span-1 p-6 flex flex-col">
          <h3 className="font-bold text-text mb-6">Atividades Recentes</h3>
          <div className="space-y-6 flex-1 overflow-hidden">
             {/* Mock activity feed */}
             <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <div className="text-sm font-medium text-text">Protocolo CFE-2026-0001 criado</div>
                <div className="text-xs text-muted">Maria Souza • 12m atrás</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
              <div>
                <div className="text-sm font-medium text-text">Protocolo CFE-2026-0002 resolvido</div>
                <div className="text-xs text-muted">João Silva • 45m atrás</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
              <div>
                <div className="text-sm font-medium text-text">Pendente: Envio de Boleto</div>
                <div className="text-xs text-muted">Aguardando financeiro • 2h atrás</div>
              </div>
            </div>
          </div>
          <button className="w-full py-3 text-sm font-semibold text-muted bg-background rounded-xl mt-4 border border-border hover:bg-border/50 transition-colors">
            Ver Tudo
          </button>
        </Card>
      </div>
    </div>
  );
}
