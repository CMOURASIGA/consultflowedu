import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./src/db/sqlite.js";
import 'dotenv/config';

// Load GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ===== API ROUTES =====
  const apiRouter = express.Router();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Departments
  apiRouter.get("/departments", (req, res) => {
    try {
      const depts = db.prepare('SELECT * FROM departments').all();
      res.json(depts);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Tickets
  apiRouter.get("/tickets", (req, res) => {
    try {
      const tickets = db.prepare(`
        SELECT t.*, d.name as department_name, r.name as requester_name 
        FROM tickets t
        LEFT JOIN departments d ON t.department_id = d.id
        LEFT JOIN requesters r ON t.requester_id = r.id
        ORDER BY t.created_at DESC
      `).all();
      res.json(tickets);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  
  apiRouter.get("/tickets/:id", (req, res) => {
    try {
      const ticket = db.prepare(`
        SELECT t.*, d.name as department_name, r.name as requester_name, r.student_name, r.email, r.phone
        FROM tickets t
        LEFT JOIN departments d ON t.department_id = d.id
        LEFT JOIN requesters r ON t.requester_id = r.id
        WHERE t.id = ?
      `).get(req.params.id);
      
      if (!ticket) return res.status(404).json({ error: "Not found" });
      
      const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(req.params.id);
      res.json({ ticket, messages });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Public Ticket Form
  apiRouter.post("/public/tickets", async (req, res) => {
    try {
      const { name, email, phone, student_name, student_class, type, original_message, organization_slug } = req.body;
      
      const org = db.prepare('SELECT id FROM organizations WHERE slug = ?').get(organization_slug) as any;
      const defaultOrg = db.prepare('SELECT id FROM organizations LIMIT 1').get() as any;
      const orgId = org ? org.id : defaultOrg?.id;
      
      if (!orgId) throw new Error("Organization not found");

      // Generate Protocol
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countRow = db.prepare("SELECT count(*) as count FROM tickets WHERE date(created_at) = date('now')").get() as any;
      const seq = String(countRow.count + 1).padStart(4, '0');
      const protocol = `CFE-${dateStr}-${seq}`;

      // Create Requester
      let requesterId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO requesters (id, organization_id, name, type, phone, email, student_name, student_class)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(requesterId, orgId, name, type, phone, email, student_name, student_class);

      // Create Ticket
      const ticketId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO tickets (id, organization_id, requester_id, protocol, original_message, status, origin_channel)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(ticketId, orgId, requesterId, protocol, original_message, 'novo', 'Formulário');
      
      res.json({ protocol, id: ticketId });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // AI Classification
  apiRouter.post("/ai/classify", async (req, res) => {
    try {
      const { texto_solicitacao, ticket_id } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Você é um assistente especializado em atendimento escolar.
Analise a solicitação abaixo e classifique a demanda conforme os setores, categorias e prioridades disponíveis.
Retorne somente JSON válido baseando-se no schema fornecido.

Setores disponíveis: secretaria, financeiro, coordenacao, direcao, ti_suporte, eventos, geral
Prioridades disponíveis: baixa, media, alta, urgente

Texto da solicitação:
${texto_solicitacao}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              categoria: { type: Type.STRING },
              setor: { type: Type.STRING },
              prioridade: { type: Type.STRING, enum: ['baixa', 'media', 'alta', 'urgente'] },
              resumo: { type: Type.STRING },
              resposta_sugerida: { type: Type.STRING },
              confianca: { type: Type.NUMBER },
              necessita_humano: { type: Type.BOOLEAN }
            },
            required: ['categoria', 'setor', 'prioridade', 'resumo', 'resposta_sugerida', 'confianca', 'necessita_humano']
          }
        }
      });
      
      if (!response.text) throw new Error("No response from AI");
      const result = JSON.parse(response.text);
      
      // Look up department id
      if (ticket_id && result.setor) {
        let deptTerm = result.setor;
        if (deptTerm === 'coordenacao') deptTerm = 'Coordenação';
        if (deptTerm === 'direcao') deptTerm = 'Direção';
        if (deptTerm === 'ti_suporte') deptTerm = 'TI/Suporte';
        if (deptTerm === 'secretaria') deptTerm = 'Secretaria';
        if (deptTerm === 'financeiro') deptTerm = 'Financeiro';
        if (deptTerm === 'eventos') deptTerm = 'Eventos';
        
        const dept = db.prepare('SELECT id FROM departments WHERE name LIKE ?').get(`%${deptTerm}%`) as any;
        
        db.prepare(`
          UPDATE tickets SET 
            summary = ?, 
            category = ?, 
            priority = ?, 
            department_id = COALESCE(?, department_id)
          WHERE id = ?
        `).run(result.resumo, result.categoria, result.prioridade, dept?.id || null, ticket_id);
        
        db.prepare(`
          INSERT INTO ai_classifications (id, ticket_id, provider, model, input_text, category, department, priority, summary, suggested_response, confidence, needs_human, raw_response)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), ticket_id, 'google', 'gemini-2.5-flash', texto_solicitacao, result.categoria, result.setor, result.prioridade, result.resumo, result.resposta_sugerida, result.confianca, result.necessita_humano ? 1 : 0, response.text);
      }
      
      res.json({ ai: result });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.use("/api", apiRouter);

  // ===== VITE MIDDLEWARE =====
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
