import { useState } from "react";
import {
  BarChart3,
  Bell,
  Compass,
  ExternalLink,
  KanbanSquare,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandLogo } from "../shared/BrandLogo";
import { useAuth } from "../../features/auth/AuthProvider";
import { useLeads } from "../../hooks/useLeads";

const nav = [
  ["/", "Command Center", LayoutDashboard],
  ["/radar", "Radar", Compass],
  ["/leads", "Leads", Users],
  ["/pipeline", "Pipeline", KanbanSquare],
  ["/demos", "Demos", Sparkles],
  ["/insights", "Insights", BarChart3],
] as const;

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal" className="space-y-1">
      {nav.map(([to, label, Icon]) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? "bg-ice/10 text-ice" : "text-muted hover:bg-white/5 hover:text-ink"}`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo
        orientation="horizontal"
        theme="light"
        size="md"
        compact={compact}
      />
      <span
        className={
          compact
            ? "sr-only"
            : "font-mono text-[10px] uppercase tracking-[.2em] text-muted"
        }
      >
        Lead Intelligence
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { data: leads = [] } = useLeads();
  const priorityCount = leads.filter((lead) => lead.priority === "Alta").length;
  const accountLabel = user?.email ?? "Usuário RanTech";
  return (
    <div className="grid-bg min-h-screen bg-navy">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-line/70 bg-[#081a2d] p-5 lg:flex lg:flex-col">
          <Brand />
          <div className="mb-10" />
          <Navigation />
          <div className="mt-auto space-y-1 text-sm text-muted">
            <a className="flex items-center gap-3 px-3 py-2.5" href="#docs">
              <ExternalLink size={17} />
              Docs da arquitetura
            </a>
            <button
              onClick={() => void signOut()}
              className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-muted hover:bg-white/5 hover:text-ink"
            >
              Sair
            </button>
            <div className="flex items-center gap-3 border-t border-line/70 pt-5">
              <img
                src="/src/assets/brand/avatar-dark.png"
                alt={`Avatar de ${accountLabel}`}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <div className="max-w-[10rem] truncate text-xs text-ink">
                  {accountLabel}
                </div>
                <div className="text-[11px]">Sales intelligence</div>
              </div>
            </div>
          </div>
        </aside>
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-navy/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[min(82vw,20rem)] border-r border-line/70 bg-[#081a2d] p-5 shadow-2xl transition-transform lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Navegação mobile"
        >
          <div className="flex items-center justify-between">
            <Brand />
            <button
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mb-10 mt-10">
            <Navigation onNavigate={() => setMenuOpen(false)} />
          </div>
          <button
            onClick={() => void signOut()}
            className="w-full border-t border-line/70 pt-5 text-left text-xs text-muted hover:text-ink"
          >
            Sair
          </button>
          <div className="flex items-center gap-3 pt-4 text-xs text-muted">
            <img
              src="/src/assets/brand/avatar-dark.png"
              alt={`Avatar de ${accountLabel}`}
              className="h-8 w-8 rounded-full object-cover"
            />
            {accountLabel}
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line/60 px-4 py-3 sm:px-5 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                aria-label="Abrir menu"
                onClick={() => setMenuOpen(true)}
                className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink lg:hidden"
              >
                <Menu size={20} />
              </button>
              <Brand compact />
              <div className="hidden items-center gap-3 text-sm text-muted sm:flex">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-ice">Intelligence</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-xs text-muted md:flex">
                <Search size={14} />
                Buscar lead{" "}
                <kbd className="ml-6 rounded border border-line px-1.5 py-0.5 font-mono text-[10px]">
                  ⌘ K
                </kbd>
              </div>
              <button
                aria-label="Notificações"
                className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink"
              >
                <Bell size={18} />
              </button>
              <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-2 py-1.5 text-[11px] text-gold sm:px-2.5 sm:text-xs">
                <Zap size={13} />
                <span className="hidden sm:inline">
                  {priorityCount} ações prioritárias
                </span>
                <span className="sm:hidden">{priorityCount}</span>
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-[1500px] p-4 sm:p-5 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
