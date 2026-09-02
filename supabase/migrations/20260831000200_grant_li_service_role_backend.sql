-- Marco D1: backend-only grants for the dedicated n8n Supabase credential.
-- RLS and authenticated workspace policies remain unchanged.
do $$
declare
  t text;
begin
  foreach t in array array[
    'li_workspaces',
    'li_workspace_members',
    'li_leads',
    'li_lead_analysis',
    'li_lead_events',
    'li_lead_contacts',
    'li_lead_objections',
    'li_lead_scores',
    'li_demos',
    'li_lead_demos',
    'li_followups'
  ] loop
    execute format(
      'grant select, insert, update, delete on table public.%I to service_role',
      t
    );
  end loop;
end $$;
