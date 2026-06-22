import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/Dashboard';
import { TicketsPage } from './pages/Tickets';
import { PublicFormPage } from './pages/PublicForm';
import { TicketDetailPage } from './pages/TicketDetail';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';
import { SettingsPage } from './pages/Settings';
import { NewTicketPage } from './pages/NewTicket';
import { KnowledgeBasePage } from './pages/KnowledgeBase';
import { DepartmentsPage } from './pages/Departments';

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
          <Route path="tickets/new" element={<NewTicketPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
