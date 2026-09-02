-- Policies for the workspace catalog. Membership remains the source of truth.
create policy li_workspaces_member_select
  on public.li_workspaces for select to authenticated
  using (exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = li_workspaces.id
      and m.user_id = (select auth.uid())
  ));

create policy li_workspaces_admin_update
  on public.li_workspaces for update to authenticated
  using (exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = li_workspaces.id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  ))
  with check (exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = li_workspaces.id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  ));

create policy li_workspaces_admin_delete
  on public.li_workspaces for delete to authenticated
  using (exists (
    select 1 from public.li_workspace_members m
    where m.workspace_id = li_workspaces.id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  ));
