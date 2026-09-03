# ConsultFlow Edu v2

## Plataforma de Inteligência Operacional Educacional

> IMPORTANTE - REGRA DE DESIGN OBRIGATÓRIA
>
> O ConsultFlow Edu faz parte do ecossistema de produtos da Consult Services. Todo desenvolvimento de interface deve usar como referência principal o Design System e a estrutura visual do 7Hub e dos produtos Consult Services já padronizados. O layout legado do protótipo ConsultFlow Edu NÃO deve ser usado como referência visual quando divergir do padrão do ecossistema.

## 1. Diretriz de produto

Evoluir o ConsultFlow Edu de um sistema de gestão de demandas com apoio de IA para uma Plataforma de Inteligência Operacional Educacional. A demanda deixa de ser apenas um chamado e passa a alimentar uma camada de inteligência capaz de identificar padrões, tendências, gargalos, anomalias, conhecimento institucional e recomendações para a gestão.

## 2. Regra transversal de Design System Consult Services

Esta seção é requisito de aceite e não recomendação estética.

### 2.1 Fonte de verdade visual

A ordem de precedência para decisões de UI/UX deve ser:

1. padrão vigente do 7Hub da Consult Services;
2. componentes e padrões compartilhados dos produtos Consult Services já padronizados;
3. requisitos funcionais específicos do ConsultFlow Edu;
4. interface legada do ConsultFlow Edu somente quando não houver conflito com os itens anteriores.

Se o layout atual do ConsultFlow Edu divergir do 7Hub, deve prevalecer o padrão do 7Hub.

### 2.2 Estrutura visual obrigatória

O sistema deve seguir o mesmo padrão de shell dos produtos Consult Services, incluindo:

- posicionamento e tratamento da marca no canto superior esquerdo conforme padrão vigente do Hub;
- menu lateral com mesma lógica de navegação, dimensões, espaçamentos e estados;
- cabeçalho/topbar compatível com o ecossistema;
- tipografia e hierarquia visual consistentes;
- grid, espaçamentos, cards, tabelas, filtros, formulários e modais alinhados ao Design System;
- ícones e padrões de interação consistentes;
- estados de hover, foco, seleção, loading, vazio, sucesso, alerta e erro padronizados;
- responsividade seguindo o comportamento dos demais produtos;
- nenhuma ação destrutiva ou confirmação crítica deve depender de dialogs nativos do navegador. Usar modal/dialog central padronizado, com título, contexto, consequência e ações claras.

### 2.3 Whitelabel obrigatório

O whitelabel deve respeitar o padrão já definido para o ecossistema:

- logo do cliente dentro de área visual controlada;
- dimensões máximas e mínimas;
- `object-contain` para evitar deformação;
- padding adequado;
- borda ou container neutro quando necessário para preservar contraste;
- tratamento correto para logos quadradas, horizontais, claras ou escuras;
- cor selecionada do menu derivada da identidade configurada, mantendo contraste e legibilidade;
- fallback para identidade Consult Services quando não houver configuração do cliente;
- a aplicação de whitelabel não pode alterar estrutura, espaçamento ou usabilidade do shell.

### 2.4 Critérios de aceite visual

Uma entrega de frontend NÃO deve ser considerada concluída se:

- o menu/cabeçalho não estiver visualmente alinhado ao 7Hub;
- a logo estiver deformada, ilegível ou fora da área prevista;
- o item selecionado do menu não respeitar a identidade configurada;
- componentes equivalentes aos demais produtos possuírem comportamento ou aparência divergente sem justificativa funcional;
- houver uso de `window.alert`, `window.confirm` ou equivalente para fluxos que exigem interação visual padronizada;
- telas novas de IA ou Inteligência Operacional parecerem um produto separado do ecossistema Consult Services.

## 3. Arquitetura alvo

### 3.1 Frontend

Manter React, TypeScript, Vite, Tailwind CSS e componentes reutilizáveis, salvo decisão técnica posterior. A tecnologia não define o Design System. Independentemente da stack, o resultado visual deve seguir o 7Hub.

### 3.2 Backend e dados

Migrar a persistência comercial para Supabase PostgreSQL, com Supabase Auth, Row Level Security e isolamento multiempresa por `organization_id`.

Entidades mínimas:

```text
organizations
organization_settings
organization_branding
users
user_roles
departments
requesters
students
tickets
ticket_messages
ticket_events
ticket_assignments
ticket_sla_events
knowledge_articles
knowledge_sources
ai_classifications
ai_insights
operational_alerts
operational_clusters
audit_logs
integration_settings
```

Toda tabela operacional deve possuir, quando aplicável:

```text
id
organization_id
created_at
updated_at
created_by
updated_by
```

## 4. Autenticação e RBAC

Substituir autenticação simulada/localStorage por Supabase Auth.

Perfis previstos:

```text
superadmin
admin
gestor
atendente
responsavel_setor
viewer
```

O `superadmin` representa administração Consult Services. Os demais perfis devem respeitar organização, setor e permissões. Service role nunca pode ser exposto ao frontend.

## 5. Navegação funcional proposta

A estrutura funcional deve ser encaixada no shell visual do 7Hub.

### Operação

1. Visão Geral
2. Central de Demandas
3. Nova Demanda

### Inteligência

4. Inteligência Operacional
5. Alertas
6. Indicadores

### Conhecimento

7. Base de Conhecimento

### Administração

8. Setores
9. Usuários
10. Configurações

## 6. Central de Demandas

Manter e evoluir o fluxo existente com protocolo, solicitante, aluno, assunto, categoria, subcategoria, setor, prioridade, criticidade, status, responsável, canal de origem, abertura, primeira resposta, prazo e resolução.

Status compatíveis:

```text
novo
em_analise
aguardando_responsavel
aguardando_solicitante
em_atendimento
resolvido
cancelado
reaberto
```

Toda mudança relevante deve gerar evento auditável.

## 7. Inteligência Artificial desacoplada de provedor

A IA não deve ficar acoplada diretamente ao Gemini, OpenAI ou outro fornecedor.

Criar abstração:

```text
AIProvider
  |- OpenAIProvider
  |- GeminiProvider
  |- FutureProvider

AIService
  |- classifyDemand()
  |- generateSuggestedResponse()
  |- summarizeDemand()
  |- detectClusters()
  |- detectAnomalies()
  |- generateOperationalInsight()
  |- queryKnowledge()
```

### 7.1 Variáveis obrigatórias

```env
AI_PROVIDER=openai
AI_MODEL=gpt-5.6
AI_API_KEY=
```

Variáveis opcionais:

```env
AI_BASE_URL=
AI_EMBEDDING_PROVIDER=
AI_EMBEDDING_MODEL=
AI_EMBEDDING_API_KEY=
AI_TIMEOUT_MS=30000
AI_MAX_RETRIES=2
```

A aplicação deve validar provedor, modelo e chave na inicialização. Chaves nunca podem ser expostas no frontend. Uma futura configuração por organização deve armazenar segredo criptografado e auditado.

## 8. Triagem inteligente

A classificação deve produzir, quando aplicável:

```text
categoria
subcategoria
setor
prioridade
resumo
resposta_sugerida
confianca
necessita_humano
intencao
tema
sentimento
criticidade
risco_operacional
entidades_identificadas
```

Regras de confiança devem preservar revisão humana para resultados incertos. IA auxilia, não decide sozinha situações pedagógicas, financeiras sensíveis ou disciplinares.

## 9. Inteligência Operacional

### 9.1 Clusters

Agrupar semanticamente demandas semelhantes por organização e período, registrando volume, tema, crescimento, confiança e tickets relacionados.

### 9.2 Anomalias

Comparar comportamento atual com baseline histórico para detectar crescimento anormal de temas, setores ou categorias.

### 9.3 Insights

Todo insight deve separar claramente:

```text
FATO OBSERVADO
HIPOTESE
EVIDENCIAS
IMPACTO
RECOMENDACAO
CONFIANCA
```

Nunca apresentar hipótese de IA como fato confirmado.

### 9.4 Dashboard executivo

Usar dados reais para apresentar demandas abertas, recebidas, resolvidas, reabertas, atrasadas, SLA cumprido, tempo médio de primeira resposta, tempo médio de resolução e backlog.

A camada de inteligência deve apresentar anomalias, clusters, tendências, gargalos e recomendações, sempre dentro do Design System do 7Hub.

## 10. Conhecimento institucional

Evoluir a base atual para memória operacional da escola. A IA poderá consultar normas, procedimentos, calendário, políticas financeiras, orientações, documentos, FAQs e respostas aprovadas.

Prever RAG institucional com isolamento por organização. Respostas aprovadas e recorrentes podem gerar sugestão de novo artigo de conhecimento, sempre com aprovação humana.

## 11. SLA e impacto mensurável

Registrar métricas reais e comparáveis:

```text
tempo_medio_primeira_resposta
tempo_medio_resolucao
sla_cumprido_percentual
taxa_reabertura
backlog
volume_por_setor
volume_por_categoria
respostas_assistidas_ia
classificacoes_automaticas
tempo_estimado_economizado
```

Quando houver baseline anterior à implantação, permitir comparação antes/depois para demonstrar impacto do produto.

## 12. Omnichannel

Evolução recomendada:

1. formulário público e cadastro manual;
2. e-mail;
3. WhatsApp;
4. APIs/ERPs escolares.

Todas as entradas devem convergir para a mesma entidade de demanda e registrar `source`/canal de origem.

## 13. Integração futura ao 7Hub e 7Service

O ConsultFlow Edu deve ser preparado para integrar o portfólio da Consult Services e não funcionar como ilha.

Prever recebimento/compatibilidade com:

```text
organization_id
user_id
role
product_access
branding
```

Diretrizes:

- somente clientes com produto habilitado devem acessar ConsultFlow Edu pelo 7Hub;
- preparar arquitetura para SSO futuro;
- manter isolamento multiempresa;
- evitar duplicar gestão contratual que pertence ao 7Service;
- permitir auditoria central de eventos administrativos relevantes no futuro;
- branding recebido do ecossistema deve respeitar as regras de whitelabel desta especificação.

## 14. Governança e auditoria da IA

Registrar para operações relevantes:

```text
organization_id
provider
model
prompt_version
input_hash
output
confidence
created_at
approved_by
approved_at
human_action
```

Estados conceituais:

```text
IA sugeriu
Humano aprovou
Humano alterou
Automacao executou
```

## 15. Segurança e LGPD

Aplicar minimização de dados, RLS, RBAC, auditoria de acessos administrativos, retenção configurável e exclusão/anomização quando aplicável. Não enviar dados pessoais desnecessários ao provedor de IA. Segredos devem existir apenas no backend.

## 16. Ordem de desenvolvimento

### P0 - Fundação comercial

1. Adotar shell e Design System do 7Hub no ConsultFlow Edu.
2. Remover autenticação simulada.
3. Implementar Supabase Auth.
4. Migrar SQLite/localStorage operacional para PostgreSQL/Supabase.
5. Implementar multiempresa e RLS.
6. Implementar RBAC.
7. Remover indicadores mockados.
8. Criar abstração de provedor de IA.
9. Criar `.env.example` com `AI_PROVIDER`, `AI_MODEL` e `AI_API_KEY`.
10. Implementar whitelabel conforme padrão do ecossistema.

### P1 - Produto operacional real

1. Consolidar Central de Demandas.
2. Histórico completo de eventos.
3. SLA real.
4. Dashboard real.
5. Auditoria.
6. Base de conhecimento operacional.

### P2 - Diferencial de inteligência

1. Clusterização.
2. Anomalias.
3. Insights operacionais.
4. Tendências.
5. Página Inteligência Operacional.
6. Alertas inteligentes.

### P3 - Conhecimento e impacto

1. RAG institucional.
2. Sugestão de artigos.
3. Indicadores de impacto.
4. Baseline antes/depois.
5. Relatórios executivos.

### P4 - Ecossistema

1. Integração 7Hub.
2. Integração 7Service.
3. SSO.
4. E-mail.
5. WhatsApp.
6. APIs de sistemas escolares.

## 17. Definition of Done

Uma funcionalidade só deve ser considerada concluída quando:

- respeitar isolamento por organização;
- respeitar RBAC;
- possuir estados de loading, erro e vazio;
- não depender de dados mockados em produção;
- ações críticas estiverem auditadas;
- chamadas de IA forem executadas apenas no backend;
- interface estiver aderente ao Design System vigente do 7Hub;
- whitelabel não quebrar layout ou contraste;
- fluxos críticos não usarem dialogs nativos do navegador;
- tela for responsiva conforme padrão do ecossistema;
- lint/build estiverem sem erro;
- houver critérios de aceite testáveis.

## 18. Regra permanente para novos desenvolvimentos

Qualquer nova tela, módulo, refatoração ou funcionalidade do ConsultFlow Edu deve verificar primeiro o padrão visual vigente do 7Hub/Consult Services. Não deve ser criado um novo padrão local para resolver algo que já possui componente ou convenção no ecossistema.

Se houver dúvida entre manter uma decisão visual legada do ConsultFlow Edu e seguir o padrão do Hub, seguir o Hub.

Essa regra deve ser considerada parte da arquitetura do produto e da Definition of Done, não apenas orientação de design.
