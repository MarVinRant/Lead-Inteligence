import { useMemo } from "react";
import { useLeads } from "../../hooks/useLeads";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/shared/PageHeader";
export function InsightsPage() {
  const { data = [] } = useLeads();
  const groups = useMemo(() => {
    const names = [...new Set(data.map((l) => l.segment))];
    return names.map((name) => ({
      name,
      count: data.filter((l) => l.segment === name).length,
    }));
  }, [data]);
  const avg = data.length
    ? (data.reduce((s, l) => s + l.score, 0) / data.length).toFixed(1)
    : "—";
  return (
    <>
      <PageHeader
        eyebrow="Performance intelligence"
        title="Insights"
        description="Uma leitura derivada dos sinais atuais do universo de leads."
      />
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="text-xs text-muted">Conversão por nicho</div>
          <div className="mt-6 space-y-5">
            {groups.map((g) => (
              <div key={g.name}>
                <div className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="font-mono text-muted">{g.count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-navy">
                  <div
                    className="h-2 rounded-full bg-ice"
                    style={{
                      width: `${data.length ? (g.count / data.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="text-xs text-muted">Score médio atual</div>
          <div className="mt-6 text-4xl font-semibold text-ice">{avg}</div>
          <div className="mt-2 text-sm text-muted">
            em {data.length} leads no universo atual
          </div>
          <div className="mt-6 rounded-xl border border-line bg-navy/50 p-4 text-sm leading-6 text-muted">
            Serviço mais recomendado:{" "}
            <span className="text-ink">
              {data[0]?.recommendedService || "—"}
            </span>
            . Os sinais são derivados do universo atual de leads.
          </div>
        </Card>
      </div>
    </>
  );
}
