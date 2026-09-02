# Workflows do Marco D1

## `RT | LI | Lead Intake | V1`

- Estado: publicado, com ingestão transacional no Supabase.
- Entrada: webhook HTTP POST.
- Validação: `company_name`, `niche` e `location` obrigatórios.
- Normalização: espaços, caixa do nicho, dígitos de telefone, URLs e fonte.
- Idempotência: `public.li_ingest_lead(jsonb)` procura, nesta ordem, WhatsApp, telefone, website, Instagram e empresa + localização, usando lock transacional.
- Saída: resultado estruturado com `created`, `duplicate`, `lead_id`, `score`, `niche_family`, serviço/demo recomendados e `dedupe_key`.
- Efeitos externos: nenhum contato enviado.

## Etapas implementadas no backend

- normalização de telefone, WhatsApp, URLs, Instagram, nicho/família e origem;
- análise V1 baseada em fatos, inferências e recomendações, com confiança;
- score auditável de 0–100 persistido em `li_lead_scores`;
- eventos úteis em `li_lead_events`;
- atualização sem sobrescrever valores existentes por vazios;
- workflow sem qualquer contato externo.

## Próximas evoluções, fora do Marco D1

1. `RT | LI | Lead Enrichment | V1`
2. `RT | LI | Lead Analyzer | V1`
3. `RT | LI | Lead Scoring | V1`
4. `RT | LI | Lead Sync | V1`
5. `RT | LI | Error Handler | V1`

Essas evoluções não fazem parte da limpeza pré-deploy nem foram iniciadas. A credencial backend e o contrato de idempotência já estão definidos para o workflow de ingestão atual.
