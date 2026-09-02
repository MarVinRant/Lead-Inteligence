# Marco D1 — arquitetura n8n

## Escopo atual

O Lead Intelligence usa workflows isolados com o prefixo `RT | LI |`. Os workflows existentes `RT | CORE | Message Processor` pertencem ao núcleo de mensagens/WhatsApp e não são reutilizados.

Fluxo planejado:

`Webhook → validação → li_ingest_lead (normalização + deduplicação + análise + scoring + recomendações + eventos) → Supabase → painel`

O workflow `RT | LI | Lead Intake | V1` recebe POST estruturado e chama a função backend-only `public.li_ingest_lead(jsonb)`. A função valida, normaliza, deduplica, preserva dados úteis, grava análise, score, recomendações e eventos em uma transação. Ainda não envia email, WhatsApp, DM ou follow-up.

## Limite de segurança

O n8n usa a credencial backend dedicada `RT | LI | Supabase Backend` para gravar nas tabelas `li_*`. Ela aponta para o projeto `Rantech-platform`; o segredo permanece armazenado exclusivamente no n8n e nunca entra em Code node, Set node, URL, documentação ou repositório. A credencial não é compartilhada com workflows `RT | CORE | ...`.

## Separação de projetos

O único banco autorizado para este fluxo é o Supabase `fsfxtongcwemaqneitvl`, usando apenas tabelas `li_*`. O projeto RanTech Agentes e suas credenciais/workflows ficam fora do Marco D1.
