import { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Configurações Gerais</h1>
        <p className="text-sm text-muted mt-1">Gerencie os parâmetros globais da plataforma ConsultFlow Edu.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'general' ? 'bg-primary/10 text-primary-dark' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" /> Dados da Instituição
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notifications' ? 'bg-primary/10 text-primary-dark' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" /> Notificações
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'security' ? 'bg-primary/10 text-primary-dark' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" /> Segurança e Acesso
          </button>
        </aside>

        <div className="flex-1">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text">Dados da Instituição</h3>
                    <p className="text-xs text-muted">Informações básicas que aparecerão nos relatórios e formulários públicos.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome da Instituição</label>
                      <Input defaultValue="ConsultFlow Educação Básica" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CNPJ</label>
                      <Input defaultValue="00.000.000/0001-00" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Endereço Principal</label>
                      <Input defaultValue="Av. Educação, 1000 - Centro - São Paulo, SP" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">E-mail de Contato Principal</label>
                      <Input defaultValue="contato@consultflow.com.br" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone Padrão</label>
                      <Input defaultValue="(11) 9999-9999" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text">Preferências de Notificações</h3>
                    <p className="text-xs text-muted">Configure como o sistema envia alertas aos administradores.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                      <div>
                        <div className="font-medium text-text text-sm">Notificar nova demanda pública</div>
                        <div className="text-xs text-muted mt-1">Envia um e-mail quando um novo formulário for preenchido via portal.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                      <div>
                        <div className="font-medium text-text text-sm">Alerta de prazo de vencimento</div>
                        <div className="text-xs text-muted mt-1">Alerta gestores quando um protocolo estiver a 24 horas do vencimento.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                      <div>
                        <div className="font-medium text-text text-sm">Resumo Semanal Administrativo</div>
                        <div className="text-xs text-muted mt-1">E-mail gerencial automático às segundas com o consolidado da semana passada.</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text">Segurança e Acesso</h3>
                    <p className="text-xs text-muted">Ajuste regras de login e sessão.</p>
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tempo de expiração da sessão (Minutos)</label>
                      <Input type="number" defaultValue="120" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Forçar troca de senhas de usuários</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>A cada 90 dias</option>
                        <option>A cada 6 meses</option>
                        <option>Nunca (Não recomendado)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  {isSaved && <span className="text-success text-sm font-medium flex items-center gap-1">Configurações salvas!</span>}
                </div>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
