-- Fixes recursive membership policies while preserving workspace-scoped RLS.
create schema if not exists private;

create or replace function private.is_workspace_member(
  p_workspace_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = p_workspace_id and m.user_id = p_user_id
  );
$$;

create or replace function private.is_workspace_admin(
  p_workspace_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = p_workspace_id
      and m.user_id = p_user_id
      and m.role = 'admin'
  );
$$;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
revoke all on function private.is_workspace_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_workspace_admin(uuid, uuid) from public, anon, authenticated;
grant execute on function private.is_workspace_member(uuid, uuid) to authenticated;
grant execute on function private.is_workspace_admin(uuid, uuid) to authenticated;

drop policy if exists li_workspace_members_select on public.li_workspace_members;
drop policy if exists li_workspace_members_admin_write on public.li_workspace_members;

create policy li_workspace_members_select
  on public.li_workspace_members for select to authenticated
  using (user_id = (select auth.uid()));

create policy li_workspace_members_admin_write
  on public.li_workspace_members for all to authenticated
  using (private.is_workspace_admin(workspace_id, (select auth.uid())))
  with check (private.is_workspace_admin(workspace_id, (select auth.uid())));

do $$
declare t text;
begin
  foreach t in array array['li_leads','li_lead_analysis','li_lead_events','li_lead_contacts','li_lead_objections','li_lead_scores','li_demos','li_lead_demos','li_followups'] loop
    execute format('drop policy if exists %I on public.%I', t||'_select', t);
    execute format('drop policy if exists %I on public.%I', t||'_insert', t);
    execute format('drop policy if exists %I on public.%I', t||'_update', t);
    execute format('drop policy if exists %I on public.%I', t||'_delete', t);
    execute format('create policy %I on public.%I for select to authenticated using (private.is_workspace_member(workspace_id, (select auth.uid())))', t||'_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (private.is_workspace_member(workspace_id, (select auth.uid())))', t||'_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (private.is_workspace_member(workspace_id, (select auth.uid()))) with check (private.is_workspace_member(workspace_id, (select auth.uid())))', t||'_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (private.is_workspace_member(workspace_id, (select auth.uid())))', t||'_delete', t);
  end loop;
end $$;
