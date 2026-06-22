import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Send, User as UserIcon, CheckCircle2 } from "lucide-react";

export function PublicFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/public/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
      
      if (json.id) {
        // Trigger AI classification asynchronously
        fetch('/api/ai/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            texto_solicitacao: data.original_message,
            ticket_id: json.id
          }),
        });
      }
    } catch(err) {
      console.error(err);
      alert('Erro ao enviar solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Solicitação Recebida!</h2>
            <p className="text-muted leading-relaxed">
              Sua solicitação foi registrada com sucesso. A escola dará continuidade ao atendimento conforme a prioridade e o setor responsável.
            </p>
            <div className="bg-light-blue w-full p-4 rounded-lg mt-6 border border-secondary/20">
              <p className="text-sm text-secondary font-medium uppercase tracking-wide">Seu Protocolo</p>
              <p className="text-2xl font-bold text-primary mt-1">{result.protocol}</p>
            </div>
            <Button className="mt-8 w-full" onClick={() => setResult(null)}>Nova Solicitação</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Portal de Atendimento</h1>
          <p className="mt-2 text-muted">ConsultFlow Edu - Escola Exemplo</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-white border-b border-border px-8 py-6">
            <CardTitle className="text-xl">Nova Solicitação</CardTitle>
            <p className="text-sm text-muted mt-1">Preencha os dados abaixo para falar com a escola.</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">Seu Nome*</label>
                  <Input name="name" required placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">Você é?*</label>
                  <select name="type" required className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <option value="">Selecione...</option>
                    <option value="Responsável">Responsável</option>
                    <option value="Aluno">Aluno</option>
                    <option value="Colaborador">Colaborador</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">E-mail</label>
                  <Input name="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">Telefone</label>
                  <Input name="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">Nome do Aluno (Se houver)</label>
                  <Input name="student_name" placeholder="Nome do aluno" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">Turma</label>
                  <Input name="student_class" placeholder="Ex: 1º Ano A" />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-semibold text-text">Como podemos ajudar?*</label>
                <textarea 
                  name="original_message" 
                  required 
                  rows={5} 
                  className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Descreva detalhadamente sua solicitação..."
                />
              </div>

              <div className="flex items-start bg-background p-4 rounded-lg">
                <div className="flex items-center h-5">
                  <input id="consent" name="consent" type="checkbox" required className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consent" className="font-medium text-text">Autorização de Dados*</label>
                  <p className="text-muted mt-1">Ao enviar esta solicitação, autorizo o uso dos dados informados exclusivamente para fins de atendimento, acompanhamento e retorno pela instituição de ensino.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" size="lg" className="w-full md:w-auto flex items-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
