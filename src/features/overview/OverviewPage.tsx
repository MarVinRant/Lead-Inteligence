import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeads } from "../../hooks/useLeads";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/shared/PageHeader";
import { StatCard } from "../../components/shared/StatCard";
import { LeadRow } from "../../components/shared/LeadRow";
import { useAuth } from "../auth/AuthProvider";
export function OverviewPage() {
  const { data = [], isLoading } = useLeads();
  const { user } = useAuth();
  const displayName = String(
    user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "equipe RanTech",
  );
  const attention = data.filter((l) => l.priority === "Alta");
  const avg = data.length
    ? (data.reduce((s, l) => s + l.score, 0) / data.length).toFixed(1)
    : "—";
  return (
    <>
      <PageHeader
        eyebrow="Command center"
        title={`Olá, ${displayName}.`}
        description="Seu radar comercial encontrou sinais fortes. Aqui está o que merece atenção antes do próximo contato."
        action={
          <Link
            to="/leads"
            className="rounded-xl bg-ice px-4 py-2.5 text-sm font-semibold text-navy"
          >
            + Adicionar lead
          </Link>
        }
      />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <StatCard
          label="Leads ativos"
          value={isLoading ? "…" : String(data.length)}
          detail="universo atual"
        />
        <StatCard
          label="Score médio"
          value={avg}
          detail={`${data.filter((l) => l.score >= 80).length} leads acima de 80`}
        />
        <StatCard
          label="Alta prioridade"
          value={String(attention.length)}
          detail="ações que exigem atenção"
          gold
        />
      </div>
      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Card>
          <div className="flex items-start justify-between gap-3 border-b border-line/60 px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold">
                Oportunidades que exigem atenção hoje
              </h2>
              <p className="mt-1 text-xs text-muted">
                Prioridade definida por score, recência e intenção
              </p>
            </div>
            <Badge tone="gold">{attention.length} prioritárias</Badge>
          </div>
          {attention.map((l) => (
            <LeadRow key={l.id} lead={l} />
          ))}
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-ice">
            <Zap size={16} />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Signal brief
            </span>
          </div>
          <h2 className="mt-5 text-xl font-semibold">
            Seu próximo melhor movimento
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {attention[0]?.diagnosis ||
              "Quando novos sinais aparecerem, sua próxima melhor ação será indicada aqui."}
          </p>
          {attention[0] && (
            <>
              <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
                <div className="text-xs text-gold">RECOMENDAÇÃO</div>
                <div className="mt-2 text-sm font-medium">
                  {attention[0].nextAction}
                </div>
                <div className="mt-1 text-xs text-muted">
                  {attention[0].recommendedDemo}
                </div>
              </div>
              <Link
                to={`/leads/${attention[0].id}`}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-ice"
              >
                Abrir dossiê <ArrowRight size={15} />
              </Link>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
