import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Send, UploadCloud, CheckCircle } from 'lucide-react';

export function NewTicketPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', contact: '', subject: '', department: '', description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const newTicket = {
      id: Date.now().toString(),
      protocol: `PRT-${Date.now().toString().slice(-6)}`,
      requester_name: formData.name,
      department_name: formData.department || 'Geral',
      priority: 'média',
      status: 'novo',
      created_at: new Date().toISOString(),
      description: formData.description
    };
    
    localStorage.setItem('tickets', JSON.stringify([newTicket, ...savedTickets]));
    
    setIsSubmitted(true);
    setTimeout(() => {
      window.location.href = '/app/tickets';
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <CheckCircle className="w-16 h-16 text-success mb-4" />
        <h2 className="text-2xl font-bold text-text">Demanda Criada com Sucesso!</h2>
        <p className="text-muted mt-2">Você será redirecionado para a lista de demandas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Nova Demanda Manual</h1>
        <p className="text-sm text-muted mt-1">Crie uma nova demanda manualmente para um setor da escola.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Solicitante</label>
                <Input required placeholder="Ex: Carlos Andrade" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail ou Telefone de Contato</label>
                <Input required placeholder="Ex: carlos@email.com" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assunto da Demanda</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option value="">Selecione um assunto...</option>
                  <option value="matricula">Dúvida sobre Matrícula</option>
                  <option value="financeiro">Financeiro / Boletos</option>
                  <option value="pedagogico">Dúvida Pedagógica</option>
                  <option value="documentos">Solicitação de Documentos</option>
                  <option value="outros">Outros / Serviços Gerais</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Setor Responsável</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option value="">Encaminhar para...</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Coordenação">Coordenação</option>
                  <option value="TI">TI Suporte</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Detalhada</label>
              <textarea 
                required
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva a solicitação da forma mais clara possível..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Anexar Arquivos (Opcional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted hover:bg-slate-50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-text">Clique para fazer upload</span>
                <span className="text-xs mt-1">PDF, JPG, PNG até 5MB</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" /> Cadastrar Demanda
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
