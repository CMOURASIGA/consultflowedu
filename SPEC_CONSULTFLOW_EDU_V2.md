# ConsultFlow Edu v2

## Plataforma de Inteligência Operacional Educacional

**Marca:** Consult Services Tecnologia  
**Produto:** ConsultFlow Edu  
**Posicionamento:** Plataforma de Inteligência Operacional Educacional  
**Assinatura atual:** Processos organizados. Decisões mais claras.  
**Diretriz de produto:** evoluir o ConsultFlow Edu de um sistema de gestão de demandas com apoio de IA para uma plataforma capaz de transformar demandas escolares em informação operacional, padrões, alertas, conhecimento institucional e recomendações para gestão.

---

# 1. Contexto e objetivo desta especificação

O ConsultFlow Edu já possui um MVP funcional com os principais fluxos previstos no projeto original:

- login;
- dashboard;
- gestão de demandas;
- criação manual de demanda;
- formulário público;
- detalhe da demanda;
- classificação por IA;
- base de conhecimento;
- setores;
- usuários;
- configurações.

A evolução descrita neste documento considera:

1. o que já foi desenvolvido no repositório atual;
2. o posicionamento original do produto;
3. a necessidade de tornar o produto comercialmente utilizável;
4. os pontos de melhoria identificados na avaliação do Programa Centelha RJ;
5. o futuro encaixe do ConsultFlow Edu no HUB de soluções da Consult Services;
6. a necessidade de diferenciar o produto de um help desk genérico com IA.

A principal mudança conceitual será:

> O chamado deixa de ser o produto. A demanda passa a ser o dado que alimenta uma camada de inteligência operacional educacional.

O ConsultFlow Edu deve ser capaz de responder não apenas "como atender esta solicitação?", mas também:

> "O que o conjunto das solicitações está dizendo sobre a operação da escola?"

---

# 2. Visão de produto

O ConsultFlow Edu deverá organizar solicitações escolares e transformar o histórico de atendimento em dados estruturados que permitam:

- compreender padrões de demanda;
- identificar gargalos;
- detectar aumento anormal de determinados assuntos;
- medir eficiência operacional;
- reduzir retrabalho;
- apoiar decisões de gestão;
- construir memória institucional;
- recomendar ações com base em fatos e evidências;
- integrar diferentes canais de atendimento em uma única visão;
- gerar indicadores comparáveis ao longo do tempo.

## 2.1 Posicionamento comercial proposto

**ConsultFlow Edu**  
**Plataforma de Inteligência Operacional Educacional**

Mensagem principal sugerida:

> Entenda o que as demandas da sua escola estão dizendo sobre a operação.

Esse posicionamento deve ser refletido no produto, na documentação, no site da Consult Services e futuramente no 7Hub.

---

# 3. Princípios de produto

1. A IA deve apoiar, não substituir a decisão humana.
2. Toda classificação relevante de IA deve ser auditável.
3. O produto deve funcionar sem dependência obrigatória de WhatsApp.
4. A arquitetura deve ser multiempresa desde a versão comercial.
5. Todo dado operacional deve pertencer explicitamente a uma organização.
6. O dashboard deve trabalhar com dados reais, nunca com indicadores mockados em produção.
7. Conhecimento institucional deve ser tratado como ativo da escola.
8. Alertas de IA devem diferenciar fato, hipótese e recomendação.
9. O produto deve ser compatível com whitelabel.
10. A solução deve ser preparada para integração futura com o 7Hub e 7Service.
11. O provedor de IA não deve ficar acoplado ao domínio do produto.
12. A experiência visual atual deve ser preservada como base, mas refinada para suportar a nova camada de inteligência.

---

# 4. Estado atual observado

O projeto atual já possui uma base adequada de navegação e domínio funcional.

## 4.1 Funcionalidades presentes

- Dashboard;
- Demandas;
- Nova Demanda;
- Formulário público;
- Detalhe da Demanda;
- Base de Conhecimento;
- Setores;
- Usuários;
- Configurações;
- Classificação por IA;
- Estrutura inicial de organizações;
- Estrutura inicial de departamentos;
- Registro das classificações de IA.

## 4.2 Pontos técnicos que devem evoluir

- autenticação simulada por localStorage;
- armazenamento operacional ainda dependente de SQLite/localStorage em partes do fluxo;
- dashboard com indicadores e gráficos mockados;
- ausência de isolamento real multiempresa por RLS;
- ausência de RBAC real;
- dependência direta do Gemini no backend;
- ausência de camada abstrata de provedor de IA;
- ausência de inteligência agregada sobre múltiplas demandas;
- ausência de alertas de anomalias;
- ausência de métricas de impacto;
- ausência de integração com o ecossistema Consult Services.

---

# 5. Arquitetura alvo

## 5.1 Front-end

Manter a linha atual:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- componentes reutilizáveis;
- deploy Vercel.

Não há necessidade de migrar para Next.js apenas por padronização. A migração somente deve ocorrer caso exista ganho técnico concreto.

## 5.2 Backend

A aplicação deve manter uma camada de API Node.js/TypeScript ou migrar para funções serverless quando fizer sentido operacional.

Responsabilidades do backend:

- autenticação e autorização;
- validação de acesso;
- manipulação de dados;
- chamadas de IA;
- logs;
- auditoria;
- tarefas de classificação;
- cálculo de SLA;
- geração de insights;
- integrações externas.

## 5.3 Banco de dados

Migrar o domínio persistente para:

- Supabase PostgreSQL;
- Row Level Security;
- multi-tenant por organization_id;
- Supabase Auth;
- Supabase Storage para arquivos e identidade visual.

---

# 6. Modelo SaaS e Multiempresa

## 6.1 Entidades mínimas

Criar ou consolidar as seguintes tabelas:

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

## 6.2 Campos padrão

Toda tabela operacional deve possuir, quando aplicável:

```text
id
organization_id
created_at
updated_at
created_by
updated_by
```

## 6.3 RLS

Regra obrigatória:

- usuário autenticado somente acessa dados de sua organização;
- superadmin da Consult Services pode acessar organizações conforme permissão administrativa;
- políticas RLS devem existir nas tabelas operacionais;
- service_role nunca deve ser exposto no front-end.

---

# 7. Autenticação e RBAC

Substituir completamente a autenticação simulada por Supabase Auth.

## 7.1 Perfis

```text
superadmin
admin
gestor
atendente
responsavel_setor
viewer
```

## 7.2 Permissões sugeridas

### superadmin

- criar organização;
- ativar/desativar cliente;
- visualizar uso;
- acessar auditoria técnica;
- configurar recursos contratados;
- configurar whitelabel;
- realizar suporte administrativo.

### admin

- administrar usuários da escola;
- setores;
- categorias;
- SLA;
- configurações;
- base de conhecimento;
- integrações;
- visualizar todos os indicadores.

### gestor

- acompanhar todas as demandas permitidas;
- redistribuir responsáveis;
- acompanhar dashboards;
- analisar inteligência operacional;
- validar recomendações.

### atendente

- criar demanda;
- assumir demanda;
- responder;
- mudar status;
- consultar conhecimento;
- usar sugestões de IA.

### responsavel_setor

- acessar demandas do setor;
- redistribuir dentro do setor;
- acompanhar SLA e backlog do setor.

### viewer

- leitura de dashboards e relatórios autorizados.

---

# 8. Whitelabel e identidade do cliente

O ConsultFlow Edu deverá seguir a mesma direção estratégica dos demais produtos da Consult Services.

## 8.1 Configurações por organização

```text
nome_exibicao
logo_url
favicon_url
cor_principal
cor_secundaria
cor_de_destaque
nome_do_ambiente
```

## 8.2 Regras visuais

- logo do cliente deve respeitar área mínima e máxima;
- aplicar borda/contêiner neutro quando a logo tiver contraste inadequado;
- menu selecionado deve derivar da cor principal do whitelabel;
- garantir contraste WCAG mínimo em textos e botões;
- manter fallback visual para identidade da Consult Services quando whitelabel não estiver configurado.

---

# 9. Direção de Design e UX

A evolução deve preservar a linguagem visual já estabelecida no MVP:

- layout claro;
- fundo predominantemente branco;
- azul como cor primária;
- menu lateral;
- cards com borda discreta;
- tipografia limpa;
- tabelas com filtros;
- badges para status e prioridade;
- boa área de respiro;
- baixa poluição visual;
- foco em desktop e notebook, com responsividade para tablet e mobile.

## 9.1 Estrutura do layout

### Barra lateral

No estado expandido:

- logo / marca do produto;
- organização atual;
- menu principal;
- separação visual entre operação, inteligência e administração;
- usuário e opção de saída no rodapé.

No estado recolhido:

- ícones com tooltip;
- manutenção da identidade visual;
- seleção claramente visível.

## 9.2 Topo

Exibir:

- nome da organização;
- ambiente;
- período quando aplicável;
- notificações/alertas;
- usuário;
- acesso ao perfil.

## 9.3 Menu proposto para v2

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

## 9.4 Cards

Manter padrão visual atual:

- fundo branco;
- borda suave;
- border-radius aproximado entre 10px e 12px;
- sombra discreta;
- títulos curtos;
- número ou conclusão em destaque;
- comparação temporal abaixo quando aplicável.

Não utilizar tendências fictícias. Toda indicação como `+12%`, `-8%`, `estável`, `aumentou` ou `reduziu` deve ser calculada a partir de dados reais.

## 9.5 Tabelas

Devem possuir:

- cabeçalho fixo quando possível;
- busca;
- filtros rápidos;
- paginação;
- ordenação;
- estados vazios claros;
- indicador visual de SLA;
- ações rápidas;
- responsividade com scroll horizontal.

## 9.6 Alertas

Alertas operacionais devem possuir hierarquia visual:

```text
informativo
atenção
alto
crítico
```

Cada alerta deve mostrar:

- título;
- descrição;
- evidência;
- período;
- impacto estimado;
- recomendação;
- confiança da IA quando aplicável;
- ação de confirmar, descartar ou investigar.

## 9.7 Inteligência Operacional

A página deve ser visualmente diferente da Central de Demandas.

Deve privilegiar:

- tendências;
- clusters;
- assuntos recorrentes;
- gráficos temporais;
- anomalias;
- gargalos;
- recomendações;
- comparativos entre períodos.

O usuário não deve perceber essa página como uma simples lista de tickets.

---

# 10. Central de Demandas

Manter e evoluir o fluxo atual.

## 10.1 Campos principais

```text
protocolo
solicitante
aluno
assunto
categoria
subcategoria
setor
prioridade
criticidade
status
responsavel
canal_origem
abertura
primeira_resposta_em
prazo
resolvido_em
```

## 10.2 Status

Manter compatibilidade com os estados existentes:

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

## 10.3 Histórico

Toda mudança significativa deve gerar evento:

```text
ticket_created
ai_classified
status_changed
department_changed
assigned
response_sent
internal_comment
sla_warning
sla_breached
resolved
reopened
```

---

# 11. IA - Arquitetura desacoplada de provedor

A IA não deve ficar acoplada diretamente ao Gemini, OpenAI ou qualquer outro fornecedor.

Criar uma abstração lógica:

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

## 11.1 Variáveis de ambiente obrigatórias

Definir no `.env.example` e na documentação:

```env
AI_PROVIDER=openai
AI_MODEL=gpt-5.6
AI_API_KEY=
```

Essas três variáveis são o padrão principal e devem permitir troca de provedor sem alteração no domínio da aplicação.

Variáveis opcionais:

```env
AI_BASE_URL=
AI_EMBEDDING_PROVIDER=
AI_EMBEDDING_MODEL=
AI_EMBEDDING_API_KEY=
AI_TIMEOUT_MS=30000
AI_MAX_RETRIES=2
```

## 11.2 Regra de seleção do provedor

Exemplo:

```text
AI_PROVIDER=openai
AI_MODEL=<modelo configurado>
AI_API_KEY=<chave>
```

ou:

```text
AI_PROVIDER=gemini
AI_MODEL=<modelo configurado>
AI_API_KEY=<chave>
```

A aplicação deve validar na inicialização:

- provedor suportado;
- modelo preenchido;
- chave presente;
- configuração válida.

Nenhuma chave deve ser exposta no front-end.

## 11.3 Configuração futura por organização

Futuramente o sistema poderá permitir configuração por cliente, mas o padrão inicial deve ser global por ambiente.

Se implementado por organização:

- a chave deve ser criptografada;
- nunca retornar chave para o front-end;
- registrar quem alterou;
- registrar data da alteração;
- permitir fallback para configuração global da Consult Services.

---

# 12. Triagem Inteligente de Demanda

Manter a classificação atual e expandir.

## 12.1 Saída mínima

```json
{
  "categoria": "financeiro",
  "subcategoria": "segunda_via_boleto",
  "setor": "financeiro",
  "prioridade": "media",
  "criticidade": "baixa",
  "intencao": "solicitar_documento_financeiro",
  "tema": "boleto",
  "sentimento": "neutro",
  "resumo": "Responsável solicita segunda via do boleto do mês atual.",
  "resposta_sugerida": "...",
  "risco_operacional": "baixo",
  "confianca": 0.94,
  "necessita_humano": true
}
```

## 12.2 Confiança

Manter regra de confiança:

- >= 0.80: pode preencher automaticamente campos não sensíveis;
- 0.60 a 0.79: sugerir e destacar para revisão;
- < 0.60: exigir revisão humana.

Campos sensíveis nunca devem ter decisão automática irreversível.

---

# 13. Inteligência Operacional

Este é o principal diferencial da versão v2.

## 13.1 Clusterização de demandas

O sistema deverá identificar demandas semanticamente semelhantes em determinado período.

Exemplo:

```text
43 solicitações relacionadas a rematrícula nas últimas 48 horas.
```

Criar entidade `operational_clusters` com:

```text
id
organization_id
title
description
period_start
period_end
ticket_count
main_category
main_subcategory
confidence
status
created_at
```

## 13.2 Detecção de anomalias

Comparar volume atual com histórico.

Exemplo:

```text
Segunda via de boleto
Média histórica: 8/dia
Hoje: 31
Variação: +287%
```

Gerar alerta somente quando atingir regra estatística ou limiar configurado.

## 13.3 Causa provável

Quando houver anomalia, a IA poderá gerar análise estruturada:

```json
{
  "fato_observado": "...",
  "hipotese_causa": "...",
  "evidencias": ["..."],
  "impacto": "...",
  "recomendacao": "...",
  "confianca": 0.82
}
```

A interface deve diferenciar visualmente:

- fato;
- hipótese;
- recomendação.

Nunca apresentar hipótese como fato confirmado.

---

# 14. Dashboard Executivo

Substituir indicadores mockados por métricas calculadas.

## 14.1 Atendimento

- demandas abertas;
- recebidas no período;
- resolvidas no período;
- reabertas;
- em atraso;
- SLA cumprido;
- tempo médio de primeira resposta;
- tempo médio de resolução;
- backlog atual.

## 14.2 Operação

- setor com maior volume;
- categorias recorrentes;
- subcategorias recorrentes;
- responsáveis com maior backlog;
- reincidência de assuntos;
- volume por canal;
- distribuição por prioridade;
- distribuição por criticidade.

## 14.3 Inteligência

- anomalias detectadas;
- tendências;
- clusters ativos;
- riscos;
- recomendações pendentes;
- possíveis oportunidades de automação.

## 14.4 Comparação temporal

Toda tendência deve indicar período de comparação:

```text
vs. período anterior
vs. 7 dias anteriores
vs. mês anterior
```

Nunca usar percentuais hardcoded.

---

# 15. Base de Conhecimento e Memória Institucional

A base de conhecimento deve evoluir de uma FAQ simples para memória operacional da organização.

## 15.1 Fontes

Poderão ser cadastrados:

- normas;
- procedimentos;
- calendário;
- políticas financeiras;
- orientações pedagógicas;
- documentos internos;
- perguntas frequentes;
- respostas aprovadas;
- artigos operacionais.

## 15.2 Uso pela IA

A IA deve consultar a base institucional antes de sugerir respostas quando a funcionalidade estiver ativada.

A resposta sugerida deve poder informar internamente quais fontes foram utilizadas.

## 15.3 Aprendizado assistido

Quando uma resposta for utilizada repetidamente, sugerir:

> Transformar esta resposta em artigo da base de conhecimento?

Quando um tema aparecer repetidamente sem conteúdo correspondente:

> Existem demandas recorrentes sobre este assunto e não há artigo correspondente na base de conhecimento.

---

# 16. Indicadores de Impacto

Criar uma área específica para comprovar valor antes e depois da implantação.

## 16.1 Métricas

- tempo médio de primeira resposta;
- tempo médio de resolução;
- percentual de SLA cumprido;
- taxa de reabertura;
- backlog;
- quantidade de demandas sem responsável;
- taxa de classificação assistida por IA;
- respostas sugeridas por IA;
- respostas aprovadas sem alteração;
- respostas aprovadas com alteração;
- reincidência;
- estimativa de tempo economizado;
- percentual de demandas identificadas em clusters.

## 16.2 Baseline

Permitir configuração de um baseline inicial quando houver dados anteriores ou período inicial de observação.

Exemplo:

```text
Tempo médio anterior: 38h
Tempo médio atual: 21h
Redução: 44,7%
```

---

# 17. SLA e qualidade operacional

## 17.1 SLA

O SLA pode ser definido por:

- prioridade;
- categoria;
- subcategoria;
- setor;
- organização.

## 17.2 Eventos de SLA

Registrar:

```text
sla_started
sla_paused
sla_resumed
sla_warning
sla_breached
sla_completed
```

## 17.3 Pausa de SLA

Permitir regra para pausar contagem quando status for:

```text
aguardando_solicitante
```

A regra deve ser configurável por organização.

---

# 18. Omnichannel

Não tornar WhatsApp requisito bloqueante.

## 18.1 Fases

### Fase 1

- formulário público;
- cadastro manual.

### Fase 2

- e-mail.

### Fase 3

- WhatsApp.

### Fase 4

- APIs de sistemas escolares;
- integrações com ERPs e portais.

## 18.2 Canal de origem

Padronizar:

```text
public_form
manual
email
whatsapp
phone
presential
internal
api
other
```

Todos os canais devem convergir para a mesma entidade de demanda.

---

# 19. Governança e auditoria da IA

Toda execução relevante deve registrar:

```text
organization_id
user_id
ticket_id
provider
model
prompt_version
input_hash
confidence
output
created_at
approved_by
approved_at
human_action
```

## 19.1 human_action

Valores sugeridos:

```text
accepted
edited
rejected
auto_applied_non_sensitive
```

## 19.2 Regras

- IA não decide questões disciplinares;
- IA não aprova negociação financeira;
- IA não encerra automaticamente casos sensíveis;
- IA não altera situação acadêmica;
- recomendações sensíveis exigem validação humana;
- logs de IA devem ser auditáveis.

---

# 20. Integração futura com 7Hub e 7Service

O ConsultFlow Edu deve ser preparado para fazer parte do HUB de soluções da Consult Services.

## 20.1 Contexto esperado do 7Hub

```text
organization_id
user_id
role
product_access
branding
```

## 20.2 Autorização

O acesso ao produto deverá poder ser determinado pelo contrato/assinatura central.

Fluxo futuro:

```text
7Service
  -> cliente
  -> contrato
  -> produtos habilitados
  -> 7Hub
  -> ConsultFlow Edu
```

## 20.3 SSO

Preparar arquitetura para que o usuário autenticado no 7Hub não precise realizar novo login no ConsultFlow Edu.

A implementação de SSO pode ser posterior, mas o domínio de usuários e organizações não deve inviabilizar essa evolução.

## 20.4 Whitelabel vindo do ecossistema

O ConsultFlow Edu deverá conseguir futuramente receber configuração de branding centralizada.

## 20.5 Eventos de auditoria futura

Eventos que poderão ser enviados ao 7Service:

```text
user_created
user_disabled
integration_enabled
integration_disabled
ai_provider_changed
ai_usage_threshold_reached
critical_error
organization_setting_changed
```

---

# 21. Diferenciação em relação ao CRM Flow

Evitar sobreposição conceitual dentro do portfólio.

## CRM Flow

Foco principal:

- relacionamento;
- atendimento;
- histórico do cliente;
- CRM;
- conversas;
- operação comercial ou de atendimento.

## ConsultFlow Edu

Foco principal:

- demandas educacionais;
- SLA escolar;
- processos de secretaria, financeiro, coordenação e direção;
- memória institucional;
- padrões operacionais;
- inteligência agregada;
- detecção de gargalos;
- recomendações para gestão escolar.

A diferenciação deve ser mantida no produto e na comunicação comercial.

---

# 22. Agente de Inteligência do ConsultFlow Edu

Criar futuramente uma camada de IA própria do produto, com nome a ser definido pela Consult Services.

O agente não deve ser apenas um chatbot lateral.

Ele deverá observar:

```text
Solicitações
   -> Classificação
   -> Atendimento
   -> Histórico
   -> Indicadores
   -> Padrões
   -> Tendências
   -> Riscos
   -> Recomendações
```

## 22.1 Funções esperadas

- responder perguntas sobre a operação;
- explicar indicadores;
- identificar crescimento de temas;
- apontar gargalos;
- sugerir criação de artigos de conhecimento;
- sugerir automações;
- gerar resumo executivo;
- explicar causas prováveis com evidências;
- nunca inventar dados inexistentes.

## 22.2 Estrutura de resposta recomendada

Sempre que aplicável:

```text
Fato
Risco
Recomendação
Evidências
Confiança
```

---

# 23. Variáveis de ambiente propostas

Adicionar ao `.env.example` quando a implementação da v2 iniciar.

```env
# Application
NODE_ENV=development
APP_URL=http://localhost:3000

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
AI_PROVIDER=openai
AI_MODEL=gpt-5.6
AI_API_KEY=
AI_BASE_URL=
AI_TIMEOUT_MS=30000
AI_MAX_RETRIES=2

# Embeddings / Knowledge
AI_EMBEDDING_PROVIDER=
AI_EMBEDDING_MODEL=
AI_EMBEDDING_API_KEY=

# Integration
HUB_INTEGRATION_ENABLED=false
HUB_BASE_URL=
HUB_CLIENT_ID=
HUB_CLIENT_SECRET=
```

## 23.1 Compatibilidade temporária

Enquanto houver código legado baseado em Gemini, pode ser mantida temporariamente:

```env
GEMINI_API_KEY=
```

Mas o código novo não deve depender diretamente dessa variável.

A migração deve convergir para:

```text
AI_PROVIDER
AI_MODEL
AI_API_KEY
```

---

# 24. Ordem de implementação

## P0 - Fundação comercial

1. Supabase PostgreSQL.
2. Migração do SQLite.
3. Supabase Auth.
4. RBAC.
5. RLS por organização.
6. Remover autenticação por localStorage.
7. Remover dependência de dados mockados no dashboard.
8. Consolidar Central de Demandas com dados reais.
9. Criar abstração AIProvider.
10. Migrar classificação existente para AIService.

## P1 - Diferencial de inteligência

1. Inteligência Operacional.
2. Clusterização de demandas.
3. Alertas de anomalias.
4. Tendências.
5. Causa provável.
6. Indicadores de impacto.
7. SLA completo.
8. Auditoria de IA.

## P2 - Conhecimento e automação

1. Base de conhecimento com fontes.
2. RAG institucional.
3. aprendizado assistido;
4. oportunidades de automação;
5. resumos executivos.

## P3 - Ecossistema

1. Whitelabel completo.
2. Contratos/produtos habilitados via 7Service.
3. integração 7Hub.
4. SSO.
5. auditoria central.

## P4 - Omnichannel

1. E-mail.
2. WhatsApp.
3. APIs.
4. ERPs escolares.

---

# 25. Critérios de aceite macro

A v2 somente deve ser considerada apta para piloto comercial quando:

- não houver autenticação fake;
- não houver dados mockados sendo apresentados como reais;
- organização A não conseguir consultar dados da organização B;
- todos os acessos administrativos respeitarem RBAC;
- IA for configurável por provedor/modelo/chave;
- chaves de IA não forem expostas no front-end;
- classificações de IA forem auditáveis;
- dashboard trabalhar com métricas reais;
- tickets tiverem SLA calculável;
- ações importantes tiverem log;
- identidade visual funcionar por organização;
- sistema estiver responsivo para desktop/notebook/tablet;
- erros e estados vazios estiverem tratados.

---

# 26. Critérios específicos para o diferencial de inovação

O ConsultFlow Edu v2 deve demonstrar tecnicamente que não é apenas um sistema de chamados com IA.

Para isso, pelo menos os seguintes recursos devem estar funcionais antes de um novo pitch de inovação:

1. clusterização de demandas semelhantes;
2. detecção de comportamento anormal;
3. comparação com histórico;
4. inteligência operacional agregada;
5. recomendação baseada em evidências;
6. memória institucional;
7. métricas de impacto antes/depois;
8. explicação transparente da atuação da IA.

---

# 27. Resultado esperado

Ao final desta evolução, o ConsultFlow Edu deverá apresentar quatro camadas claramente distintas:

```text
1. Atendimento
   Registro e tratamento das demandas.

2. Gestão
   SLA, responsáveis, backlog e indicadores.

3. Conhecimento
   Memória institucional e respostas padronizadas.

4. Inteligência
   Padrões, tendências, anomalias, riscos e recomendações.
```

Essa estrutura permitirá posicionar o ConsultFlow Edu de forma mais clara dentro do HUB da Consult Services e ampliar seu diferencial comercial e tecnológico.

---

# 28. Diretriz final para desenvolvimento

O desenvolvimento da v2 deve preservar tudo que estiver funcional no MVP e evoluir por etapas, evitando reescrita completa sem necessidade.

Prioridade arquitetural:

```text
Segurança
-> Multiempresa
-> Dados reais
-> IA desacoplada
-> Inteligência operacional
-> Conhecimento
-> Integrações
```

Não iniciar integrações complexas com canais externos antes de consolidar essa base.

**Documento de referência para evolução do ConsultFlow Edu v2.**
