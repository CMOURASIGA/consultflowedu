import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/Dashboard';
import { TicketsPage } from './pages/Tickets';
import { PublicFormPage } from './pages/PublicForm';
import { TicketDetailPage } from './pages/TicketDetail';
import { LoginPage } from './pages/Login';

// Simulador de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public" element={<PublicFormPage />} />
        
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="tickets/new" element={
            <div className="p-8 text-center text-muted">Tela de Nova Demanda Manual (Em Breve)</div>
          } />
          <Route path="knowledge" element={
            <div className="p-8 text-center text-muted">Módulo de Base de Conhecimento (Em Breve)</div>
          } />
          <Route path="departments" element={
            <div className="p-8 text-center text-muted">Gestão de Setores (Em Breve)</div>
          } />
          <Route path="users" element={
            <div className="p-8 text-center text-muted">Gestão de Usuários (Em Breve)</div>
          } />
          <Route path="settings" element={
            <div className="p-8 text-center text-muted">Configurações Gerais (Em Breve)</div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
