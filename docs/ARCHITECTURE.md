# Arquitetura do Lead Intelligence

Fluxo principal: `Page → hook TanStack Query → LeadsRepository → Supabase Data API → PostgreSQL`.

Em testes e demonstrações isoladas, o mesmo contrato pode usar `MSW`; a seleção é feita por configuração e o service worker não é iniciado no modo Supabase. Os componentes não conhecem a fonte de dados.

O n8n publica entradas pelo workflow dedicado `RT | LI | Lead Intake | V1`, que chama a RPC transacional `public.li_ingest_lead(jsonb)`. A RPC concentra normalização, deduplicação, análise, score, recomendações e eventos. AuthProvider centraliza sessão e workspace; ProtectedRoute protege a aplicação; RLS limita as tabelas `li_*` ao membership do workspace.
