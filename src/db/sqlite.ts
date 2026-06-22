import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
export const db = new Database(dbPath);

console.log(`[SQLite] Connected to database at ${dbPath}`);

// Initialize schema
db.exec(`
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  document TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  department_id TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  default_user_id TEXT REFERENCES users(id),
  default_sla_hours INTEGER DEFAULT 48,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requesters (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT,
  phone TEXT,
  email TEXT,
  student_name TEXT,
  student_class TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  requester_id TEXT REFERENCES requesters(id),
  protocol TEXT UNIQUE NOT NULL,
  title TEXT,
  original_message TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  department_id TEXT REFERENCES departments(id),
  priority TEXT,
  status TEXT DEFAULT 'novo',
  assigned_user_id TEXT REFERENCES users(id),
  origin_channel TEXT DEFAULT 'Formulário',
  due_at DATETIME,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT REFERENCES tickets(id),
  user_id TEXT REFERENCES users(id),
  message_type TEXT,
  content TEXT NOT NULL,
  is_internal INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_base (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  title TEXT NOT NULL,
  category TEXT,
  department_id TEXT REFERENCES departments(id),
  question TEXT,
  answer TEXT NOT NULL,
  tags TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_classifications (
  id TEXT PRIMARY KEY,
  ticket_id TEXT REFERENCES tickets(id),
  provider TEXT,
  model TEXT,
  input_text TEXT,
  category TEXT,
  department TEXT,
  priority TEXT,
  summary TEXT,
  suggested_response TEXT,
  confidence REAL,
  needs_human INTEGER DEFAULT 1,
  raw_response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Seed initial data if empty
const orgCount = db.prepare('SELECT COUNT(*) as count FROM organizations').get() as { count: number };
if (orgCount.count === 0) {
  const dt = new Date().toISOString();
  
  const orgId = crypto.randomUUID();
  db.prepare('INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)').run(orgId, 'ConsultFlow Edu', 'consultflowedu');
  
  // Seed departments
  const defaultDepts = ['Secretaria', 'Financeiro', 'Coordenação', 'Direção', 'TI/Suporte', 'Eventos', 'Geral'];
  const pInsertDept = db.prepare('INSERT INTO departments (id, organization_id, name) VALUES (?, ?, ?)');
  const generatedDepts: {id: string, name: string}[] = [];
  
  for (const name of defaultDepts) {
    const dId = crypto.randomUUID();
    pInsertDept.run(dId, orgId, name);
    generatedDepts.push({id: dId, name});
  }
}
