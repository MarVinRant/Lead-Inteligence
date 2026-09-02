import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLead, useUpdateLead } from "../../hooks/useLeads";
import type { Lead } from "../../domain/leads/types";
const schema = z.object({
  company: z.string().min(2, "Informe a empresa"),
  segment: z.enum([
    "Oficina & mecânica",
    "Barbearia & beleza",
    "Nicho emergente",
  ]),
  city: z.string().min(2, "Informe a cidade"),
  website: z.string().min(2, "Informe um canal digital"),
  recommendedService: z.string().min(2, "Informe o serviço"),
  nextAction: z.string().min(2, "Informe a próxima ação"),
  score: z.coerce.number().min(0).max(100),
});
type FormData = z.infer<typeof schema>;
export function LeadFormDialog({
  lead,
  onClose,
  onSaved,
}: {
  lead?: Lead;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const create = useCreateLead();
  const update = useUpdateLead();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: lead
      ? {
          company: lead.company,
          segment: lead.segment,
          city: lead.city,
          website: lead.website,
          recommendedService: lead.recommendedService,
          nextAction: lead.nextAction,
          score: lead.score,
        }
      : {
          company: "",
          segment: "Nicho emergente",
          city: "",
          website: "",
          recommendedService: "Landing page de conversão",
          nextAction: "Fazer contato inicial",
          score: 50,
        },
  });
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const submit = async (data: FormData) => {
    if (lead) {
      await update.mutateAsync({ id: lead.id, ...data });
      onSaved("Lead atualizado com sucesso");
    } else {
      await create.mutateAsync({
        ...data,
        owner: "Equipe RanTech",
        priority:
          data.score >= 80 ? "Alta" : data.score >= 60 ? "Média" : "Baixa",
        painPoints: [],
        opportunities: [],
        objections: [],
        history: [],
        commercialMemory: "Ainda sem memória comercial",
        diagnosis: "Diagnóstico pendente",
        recommendedDemo: "Demo a definir",
      });
      onSaved("Lead criado com sucesso");
    }
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-navy/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-[#0b1d31] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="lead-form-title" className="text-xl font-semibold">
              {lead ? "Editar lead" : "Adicionar lead"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Atualize os dados comerciais deste lead.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-xl text-muted hover:bg-white/5"
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit(submit)}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs text-muted">Empresa</span>
            <input
              {...register("company")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
            {errors.company && (
              <span className="mt-1 block text-xs text-rose-300">
                {errors.company.message}
              </span>
            )}
          </label>
          <label>
            <span className="mb-1.5 block text-xs text-muted">Nicho</span>
            <select
              {...register("segment")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            >
              <option>Oficina & mecânica</option>
              <option>Barbearia & beleza</option>
              <option>Nicho emergente</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs text-muted">Cidade</span>
            <input
              {...register("city")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
            {errors.city && (
              <span className="mt-1 block text-xs text-rose-300">
                {errors.city.message}
              </span>
            )}
          </label>
          <label>
            <span className="mb-1.5 block text-xs text-muted">
              Website / canal
            </span>
            <input
              {...register("website")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs text-muted">Score</span>
            <input
              type="number"
              {...register("score")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs text-muted">
              Serviço recomendado
            </span>
            <input
              {...register("recommendedService")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs text-muted">
              Próxima ação
            </span>
            <input
              {...register("nextAction")}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2.5 text-sm outline-none focus:border-ice"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line px-4 py-2.5 text-sm text-muted hover:text-ink"
            >
              Cancelar
            </button>
            <button
              disabled={isSubmitting}
              className="rounded-xl bg-ice px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-60"
            >
              {isSubmitting ? "Salvando…" : "Salvar lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
