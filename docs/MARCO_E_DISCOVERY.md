# Marco E — Lead Discovery Automático

## Auditoria do estado atual

O projeto já possui a base necessária para o Marco E:

- `RT | LI | Lead Intake | V1` recebe payloads estruturados no n8n;
- `li_ingest_lead(jsonb)` concentra normalização, deduplicação, análise, score e eventos;
- `li_leads` já possui `workspace_id`, `dedupe_key`, `source` e `source_url`;
- Supabase Auth, RLS por workspace e credencial backend isolada estão validados;
- a UI usa hooks e Repository Pattern, sem consumir arrays diretamente nas páginas;
- o deploy Vercel e o repositório GitHub estão conectados.

Não é necessário alterar a arquitetura existente nem iniciar Claudete, WhatsApp ou contato comercial.

## Arquitetura proposta

```text
Schedule Trigger (n8n)
  → ler configuração ativa
  → Google Places Text Search (New)
  → normalizar candidatos
  → deduplicar por place_id, telefone, website e dedupe_key
  → Gemini estruturado para classificar/enriquecer
  → li_ingest_lead(jsonb) por candidato novo
  → registrar execução, encontrados, novos e descartados
  → painel consulta hooks/repository
```

Google Places deve ser chamado somente no n8n, nunca no navegador. A integração recomendada é o endpoint oficial Text Search (New), com `X-Goog-FieldMask` mínimo para controlar custo e tamanho da resposta. A API limita o retorno por página e exige field mask. Consulte a [documentação oficial do Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search) e [uso e faturamento](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing).

Gemini também deve ser chamado somente no n8n. A resposta deve usar JSON estruturado com schema fechado para evitar que o modelo escreva diretamente em tabelas. Consulte a [documentação oficial de structured output](https://ai.google.dev/gemini-api/docs/structured-output).

## Persistência nova sugerida

### `li_discovery_configs`

Configurações editáveis do radar automático:

- `id`, `workspace_id`, `name`;
- `niche`, `region`, `query`;
- `provider` (`google_places`);
- `daily_limit` com teto inicial de 15;
- `schedule_timezone`, `schedule_hour`;
- `is_active`, `last_run_at`, `next_run_at`;
- `created_by`, `created_at`, `updated_at`.

### `li_discovery_runs`

Auditoria de cada execução:

- `id`, `workspace_id`, `config_id`;
- `status` (`running`, `succeeded`, `partial`, `failed`);
- `started_at`, `finished_at`;
- `found_count`, `new_count`, `discarded_count`, `error_count`;
- `provider_request_id` sem armazenar chaves;
- `error_summary` sem payloads sensíveis.

### `li_discovery_candidates`

Rastreabilidade entre resultado externo e lead:

- `id`, `workspace_id`, `run_id`, `config_id`;
- `provider`, `provider_place_id`;
- `company_name`, `niche`, `location`, `phone`, `website_url`, `source_url`;
- `dedupe_key`, `decision` (`new`, `duplicate`, `discarded`, `error`);
- `lead_id` quando houver inserção;
- `enrichment jsonb` somente com campos comerciais necessários;
- `created_at`.

Índices e restrições devem garantir unicidade por workspace + provedor + `provider_place_id` e apoiar telefone, website e `dedupe_key`. A inserção definitiva continua passando pela RPC atual, evitando duplicar regra de negócio no n8n.

## Configuração inicial

Começar com uma única configuração ativa e limite de 15 leads/dia:

- nicho: oficinas e mecânicas;
- região: uma cidade ou conjunto pequeno de cidades definido no painel;
- janela: uma execução diária em horário configurável;
- `pageSize` do Places limitado ao necessário;
- somente campos mínimos: id, nome, endereço, telefone, website e URL do Maps quando disponíveis.

Barbearias e nichos emergentes entram como configurações adicionais, pausáveis e editáveis, sem criar novos workflows por nicho.

## Segurança e custos

- API key do Google fica em credencial própria do n8n, nunca em Code node, Set node, frontend ou Git;
- API key do Gemini fica em credencial própria do n8n;
- nenhuma chamada é feita pelo navegador;
- nenhum contato é enviado automaticamente;
- o limite diário de 15 é validado no workflow e no banco;
- erros de quota interrompem a execução com status `partial`/`failed`, sem loop agressivo;
- o workflow usa retry limitado e backoff;
- cada execução é idempotente por configuração e data;
- RLS e grants das tabelas atuais permanecem intactos.

O n8n deve usar credenciais com nomes exclusivos `RT | LI | ...`, sem reutilizar `RT | CORE | ...`. A ativação automática somente deve ocorrer depois de testar uma execução controlada e confirmar as quotas/custos do projeto Google Cloud e do Gemini.

## UI necessária

Adicionar uma área compacta de configuração, sem redesenhar o painel:

- status ativa/pausada;
- nicho, região e query;
- limite diário;
- última execução e próxima execução;
- encontrados, novos e descartados;
- erro resumido quando aplicável;
- ações pausar, reativar e editar.

Os dados devem seguir `UI → hooks → repository → Supabase`. A configuração e o histórico não devem ser lidos diretamente pelas páginas.

## Fases de implementação

1. Migration versionada, tipos e policies RLS para as três tabelas novas.
2. Repository e hooks para configurações e execuções.
3. UI de status/configuração e testes de loading, erro e pausa.
4. Credenciais separadas no n8n e workflow `RT | LI | Lead Discovery | V1`.
5. Teste controlado com uma configuração e limite baixo.
6. Ativação diária, observabilidade e validação de deduplicação.

## Pré-requisitos externos

Antes de ativar o workflow, será necessário configurar manualmente, sem enviar segredos pelo chat:

1. Google Cloud com Places API (New), faturamento/quota e uma API key restrita ao uso do n8n.
2. Credencial Gemini com limite de uso definido.
3. Duas credenciais exclusivas no n8n e acesso ao projeto `Rantech-platform`.
4. Decisão da primeira região de busca e horário diário.

O projeto não possui esses segredos nem uma região/horário aprovados em configuração. Portanto, a implementação pode começar pela camada local e pela migration, mas a ativação real deve aguardar esses pré-requisitos para não gerar custo ou descoberta fora do escopo.
