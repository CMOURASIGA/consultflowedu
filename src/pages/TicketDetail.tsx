import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, User, Building, Clock, FileText, Info, Send, Bot, RefreshCw } from "lucide-react";

export function TicketDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ticket: any, messages: any[]} | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = () => {
    setLoading(true);
    fetch(`/api/tickets/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted animate-pulse">Carregando detalhes...</div>;
  if (!data || !data.ticket) return <div className="p-8 text-center text-danger">Demanda não encontrada.</div>;

  const { ticket, messages } = data;

  const handleReclassify = async () => {
    if (!confirm('Deseja reprocessar a classificação com a IA?')) return;
    try {
      await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          texto_solicitacao: ticket.original_message,
          ticket_id: ticket.id
        }),
      });
      fetchTicket();
    } catch(err) {
      alert('Erro ao reclassificar');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link to="/app/tickets" className="text-muted hover:text-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
            {ticket.protocol}
            <Badge variant="new" className="text-sm">{ticket.status.toUpperCase()}</Badge>
            {ticket.priority && <Badge variant="secondary" className="text-sm">{ticket.priority}</Badge>}
          </h1>
          <p className="text-muted">Aberto em {new Date(ticket.created_at).toLocaleString('pt-BR')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">Alterar Status</Button>
          <Button variant="outline">Assumir</Button>
          <Button className="bg-success text-white hover:bg-success/90 border-0">Concluir</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Messages & Request */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader className="border-b border-border bg-background/50 flex flex-row items-center justify-between py-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="w-5 h-5" /> Solicitação Original
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-text whitespace-pre-wrap whitespace-normal leading-relaxed">
                {ticket.original_message}
              </p>
            </CardContent>
          </Card>

          {/* Setup AI Box if we have summaries */}
          <Card className="border-secondary/20 shadow-sm bg-[#f8fbff]">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-secondary flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <Bot className="w-4 h-4" /> Inteligência Artificial
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-secondary" onClick={handleReclassify}>
                <RefreshCw className="w-4 h-4 mr-2" /> Reprocessar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase mb-1">Resumo da Demanda</h4>
                <p className="text-sm text-text bg-white p-3 rounded-md border border-secondary/20">
                  {ticket.summary || "Resumo ainda não gerado pela IA."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <h4 className="text-xs font-semibold text-muted uppercase mb-1">Categoria Sugerida</h4>
                  <Badge variant="outline" className="bg-white">{ticket.category || 'Não definido'}</Badge>
                 </div>
                 <div>
                  <h4 className="text-xs font-semibold text-muted uppercase mb-1">Setor Sugerido</h4>
                  <Badge variant="outline" className="bg-white">{ticket.department_name || 'Não definido'}</Badge>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Mocked conversation thread */}
          <div className="space-y-4 pt-4">
             <h3 className="text-lg font-semibold text-primary">Histórico</h3>
             {messages.length === 0 ? (
               <div className="p-8 text-center text-muted border border-dashed border-border rounded-xl">
                 Nenhuma interação registrada ainda.
               </div>
             ) : (
                messages.map((m: any) => (
                  <Card key={m.id}>
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-light-blue flex items-center justify-center text-primary font-bold shrink-0">
                        OP
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-primary">Equipe Escolar</p>
                          <p className="text-xs text-muted leading-relaxed">{new Date(m.created_at).toLocaleString('pt-BR')}</p>
                        </div>
                        <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
             )}
          </div>

          {/* Reply Box */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-border bg-background/50 rounded-t-xl flex gap-2">
                <Button variant="secondary" size="sm" className="bg-white">Responder Solicitante</Button>
                <Button variant="ghost" size="sm">Nota Interna</Button>
              </div>
              <div className="p-4">
                <textarea 
                  className="w-full border-0 focus:ring-0 p-2 text-sm bg-transparent resize-none h-24"
                  placeholder="Escreva sua resposta..."
                />
              </div>
              <div className="p-4 border-t border-border flex justify-between items-center bg-background/30 rounded-b-xl">
                 <div className="text-xs text-muted flex items-center gap-1">
                   <Bot className="w-3 h-3" /> Usar resposta sugerida
                 </div>
                 <Button className="flex items-center gap-2">
                   Enviar <Send className="w-4 h-4 ml-1" />
                 </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
               <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-muted" /> Solicitante
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                 <p className="text-sm font-semibold text-primary">{ticket.requester_name}</p>
                 <p className="text-xs text-muted mt-0.5">{ticket.email || 'Sem e-mail'}</p>
                 <p className="text-xs text-muted mt-0.5">{ticket.phone || 'Sem telefone'}</p>
               </div>
               {ticket.student_name && (
                 <div className="pt-4 border-t border-border">
                   <p className="text-xs text-muted uppercase tracking-wider mb-1">Aluno Relacionado</p>
                   <p className="text-sm font-medium">{ticket.student_name}</p>
                 </div>
               )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
               <CardTitle className="text-base flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted" /> Detalhes da Demanda
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                 <p className="text-xs text-muted uppercase tracking-wider mb-1">Setor</p>
                 <p className="text-sm font-medium">{ticket.department_name || '-'}</p>
               </div>
               <div>
                 <p className="text-xs text-muted uppercase tracking-wider mb-1">Categoria</p>
                 <p className="text-sm font-medium">{ticket.category || '-'}</p>
               </div>
               <div>
                 <p className="text-xs text-muted uppercase tracking-wider mb-1">Canal de Origem</p>
                 <p className="text-sm font-medium">{ticket.origin_channel}</p>
               </div>
               <div className="pt-4 border-t border-border">
                 <p className="text-xs text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                   <Clock className="w-3 h-3" /> Prazo SLA
                 </p>
                 <p className="text-sm font-medium">{'48 horas (Padrão)'}</p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
