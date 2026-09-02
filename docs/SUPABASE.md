# Marco C — autenticação e workspace

## Modelo

O frontend usa `@supabase/supabase-js` apenas com a URL do projeto e a chave publishable. A camada de UI não acessa `supabase.auth` nem tabelas diretamente: o estado de sessão fica em `AuthProvider`, o acesso ao workspace fica centralizado nesse provider e os dados comerciais passam por repositories consumidos pelos hooks.

As tabelas isoladas `li_*` possuem `workspace_id`. O acesso autenticado é permitido somente quando `auth.uid()` possui membership em `li_workspace_members` para o mesmo workspace. A role inicial é `admin`; a policy de escrita de memberships exige admin do workspace. A chave secreta backend (`sb_secret_...`, equivalente operacional à role `service_role`) não é usada no frontend e não deve ser adicionada a arquivos `.env` expostos pelo Vite.

## Configuração local

Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_PUBLISHABLE_KEY` com a chave publishable exibida em Project Settings → API. Para usar o banco real, defina `VITE_DATA_SOURCE=supabase`; com `msw`, o app continua no modo local de demonstração.

## Primeiro usuário

A migration cria o workspace RanTech, mas não cria usuário em `auth.users` e não inclui senha no repositório.

1. Em Authentication → Users, crie o usuário por email/senha e confirme o email para desenvolvimento.
2. Copie o UUID do usuário.
3. No SQL Editor, associe-o ao workspace:

```sql
insert into public.li_workspace_members (workspace_id, user_id, role)
values ('00000000-0000-0000-0000-000000000001', 'UUID_DO_USUARIO', 'admin')
on conflict (workspace_id, user_id)
do update set role = excluded.role;
```

Depois, abra `/login`. A sessão é persistida pelo Supabase Auth, as rotas internas são protegidas e o botão `Sair` encerra a sessão.

## Segurança e evolução

- `anon` não possui grants nas tabelas `li_*` e não há policies públicas.
- `service_role` possui grants explícitos de `SELECT`, `INSERT`, `UPDATE` e `DELETE` somente nas tabelas isoladas `li_*`, para uso da credencial backend dedicada do n8n. Isso não libera acesso anônimo e não desabilita RLS.
- A migration `20260831000200_grant_li_service_role_backend.sql` corrige a ausência desses grants. A migration inicial habilitou RLS e concedeu acesso a `authenticated`, mas não havia revogado `service_role`; os privilégios backend simplesmente não tinham sido concedidos.
- As policies de SELECT/INSERT/UPDATE/DELETE verificam membership no workspace; operações de membership exigem o próprio usuário ou admin.
- O workspace atual vem do membership autenticado, com fallback apenas para o UUID configurado no ambiente durante o bootstrap.
- Para adicionar membros no futuro, um fluxo administrativo no backend ou Edge Function deve validar que o solicitante é admin, criar o usuário via Auth e inserir o membership. Senhas e service role devem permanecer fora do navegador.
- A troca futura para Supabase não altera componentes: `VITE_DATA_SOURCE` escolhe o repository e os hooks continuam sendo a fronteira de dados.
