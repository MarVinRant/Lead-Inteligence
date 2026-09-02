import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { LeadFormDialog } from "./LeadFormDialog";

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const onClose = vi.fn();
  const onSaved = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <LeadFormDialog onClose={onClose} onSaved={onSaved} />
    </QueryClientProvider>,
  );
  return { onClose, onSaved };
}

describe("LeadFormDialog", () => {
  it("exibe validação para campos obrigatórios", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Salvar lead" }));

    expect(await screen.findByText("Informe a empresa")).toBeInTheDocument();
    expect(screen.getByText("Informe a cidade")).toBeInTheDocument();
  });

  it("envia um lead válido e fecha o diálogo", async () => {
    const { onClose, onSaved } = renderForm();

    fireEvent.change(screen.getByLabelText("Empresa"), {
      target: { value: "Oficina Nova" },
    });
    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "São Paulo" },
    });
    fireEvent.change(screen.getByLabelText("Website / canal"), {
      target: { value: "Instagram" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar lead" }));

    await waitFor(() =>
      expect(onSaved).toHaveBeenCalledWith("Lead criado com sucesso"),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
