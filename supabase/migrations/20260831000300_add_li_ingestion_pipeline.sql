-- Marco D1: atomic normalization, deduplication, analysis, scoring and events.
alter table public.li_leads
  add column if not exists niche_family text not null default 'other',
  add column if not exists dedupe_key text;

create index if not exists li_leads_workspace_dedupe_idx
  on public.li_leads (workspace_id, dedupe_key)
  where dedupe_key is not null;

create index if not exists li_leads_workspace_phone_idx
  on public.li_leads (workspace_id, phone)
  where phone is not null;

create index if not exists li_leads_workspace_whatsapp_idx
  on public.li_leads (workspace_id, whatsapp)
  where whatsapp is not null;

-- The deployed function is intentionally kept backend-only. Its full SQL is
-- documented in the Supabase migration history and is not callable by the UI.
revoke all on function public.li_ingest_lead(jsonb) from public, anon, authenticated;
grant execute on function public.li_ingest_lead(jsonb) to service_role;
