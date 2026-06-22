export interface Organization {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: 'admin' | 'school_admin' | 'manager' | 'agent' | 'department_head';
  department_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  default_user_id: string | null;
  default_sla_hours: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Requester {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  phone: string | null;
  email: string | null;
  student_name: string | null;
  student_class: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  organization_id: string;
  requester_id: string;
  protocol: string;
  title: string | null;
  original_message: string;
  summary: string | null;
  category: string | null;
  department_id: string | null;
  priority: 'baixa' | 'media' | 'alta' | 'urgente' | null;
  status: 'novo' | 'em_analise' | 'aguardando_responsavel' | 'aguardando_solicitante' | 'em_atendimento' | 'resolvido' | 'cancelado' | 'reaberto';
  assigned_user_id: string | null;
  origin_channel: string;
  due_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  message_type: 'assumed' | 'status_change' | 'comment' | 'reply' | 'ai_suggestion' | 'created';
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface KnowledgeBase {
  id: string;
  organization_id: string;
  title: string;
  category: string | null;
  department_id: string | null;
  question: string | null;
  answer: string;
  tags: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AiClassification {
  id: string;
  ticket_id: string;
  provider: string;
  model: string;
  input_text: string;
  category: string | null;
  department: string | null;
  priority: string | null;
  summary: string | null;
  suggested_response: string | null;
  confidence: number;
  needs_human: boolean;
  raw_response: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  old_data: string | null;
  new_data: string | null;
  created_at: string;
}

