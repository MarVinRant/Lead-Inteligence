# Scoring V1 — regras implementadas

O scoring será calculado depois da normalização e do enriquecimento, em escala 0–100 e com componentes registrados em `li_lead_scores`:

- aderência ao serviço;
- intensidade da oportunidade;
- facilidade de contato;
- presença digital;
- potencial de recorrência;
- qualidade dos dados.

Componentes implementados: `service_fit`, `opportunity_strength`, `contactability`, `digital_gap`, `recurrence_potential` e `data_quality`. A soma é limitada a 100; `80–100` é Alta, `60–79` Média e abaixo de 60 Baixa. Cada execução grava componentes, justificativa, `rules_version = v1-rules` e `calculated_at`. Não há IA nesta V1; recomendações são determinísticas e auditáveis.
