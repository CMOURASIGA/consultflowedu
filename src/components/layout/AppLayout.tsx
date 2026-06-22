import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Ticket, FolderOpen, BookOpen, Settings, Users, Building, LogOut } from "lucide-react";

export function AppLayout() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { label: "Demandas", href: "/app/tickets", icon: Ticket },
    { label: "Nova demanda", href: "/app/tickets/new", icon: FolderOpen },
    { label: "Base de conhecimento", href: "/app/knowledge", icon: BookOpen },
    { label: "Setores", href: "/app/departments", icon: Building },
    { label: "Usuários", href: "/app/users", icon: Users },
    { label: "Configurações", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex text-text bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary flex flex-col hidden md:flex border-r border-secondary">
        <div className="py-8 flex flex-col items-center justify-center px-5 border-b border-white/10">
          <div className="bg-[#F8FAFC] w-full rounded-xl p-2 flex flex-col items-center justify-center shadow-sm overflow-hidden">
            <img src="https://i.imgur.com/gxXnYsA.png" alt="Consult Services" className="h-24 scale-150 w-full object-contain mix-blend-multiply" />
          </div>
          <div className="font-bold text-xl text-white tracking-tight mt-5">ConsultFlow Edu</div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/20 text-primary-dark font-medium' 
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              window.location.href = "/login";
            }}
            className="flex items-center space-x-3 text-slate-400 hover:text-white w-full px-3 py-2 rounded-lg transition-colors hover:bg-white/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8">
          <div className="text-sm font-medium text-muted">
            Escola Exemplo <span className="mx-2">•</span> Ambiente de Homologação
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-none text-text">Admin</p>
              <p className="text-muted text-xs mt-1">Secretaria</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
