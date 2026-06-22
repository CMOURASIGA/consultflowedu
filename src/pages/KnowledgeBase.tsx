import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Search, PlusCircle, Book, FileText, ChevronRight } from 'lucide-react';

const initialArticles = [
  { id: 1, title: 'Como redefinir a senha do portal do aluno', category: 'Suporte de TI', views: 342, date: '12 Out 2026' },
  { id: 2, title: 'Passo a passo para emissão de 2ª via de boleto', category: 'Financeiro', views: 854, date: '05 Set 2026' },
  { id: 3, title: 'Documentos necessários para transferência', category: 'Secretaria', views: 420, date: '21 Ago 2026' },
  { id: 4, title: 'Cronograma de avaliações do ensino médio', category: 'Pedagógico', views: 512, date: '01 Nov 2026' },
];

export function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    let savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    if (savedArticles.length === 0) {
      savedArticles = initialArticles;
      localStorage.setItem('articles', JSON.stringify(savedArticles));
    }
    setArticles(savedArticles);
  }, []);

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Base de Conhecimento</h1>
          <p className="text-sm text-muted mt-1">Artigos e tutoriais para atendimento mais rápido.</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Artigo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              placeholder="Buscar artigos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-text text-sm mb-3">Categorias</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-primary/10 text-primary-dark font-medium">Todas as Categorias (12)</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100">Secretaria (4)</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100">Financeiro (3)</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100">Pedagógico (2)</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100">Suporte de TI (3)</button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-light-blue flex items-center justify-center flex-shrink-0 text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors truncate">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted mt-1 gap-3">
                    <span className="font-medium px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{article.category}</span>
                    <span>• {article.views} visualizações</span>
                    <span>• Atualizado em {article.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
