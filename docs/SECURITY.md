# Segurança

## Aplicação

- Login por Supabase Auth com email e senha.
- Rotas internas protegidas por `ProtectedRoute`.
- A sessão não é manipulada diretamente pelas features; `AuthProvider` concentra o fluxo.
- O frontend usa somente a chave publishable do projeto.

## Dados comerciais

- As tabelas do Lead Intelligence usam o namespace `li_*` e possuem `workspace_id`.
- RLS limita leitura e escrita ao workspace em que o usuário autenticado possui membership.
- `anon` não possui acesso às tabelas comerciais.
- A credencial backend `RT | LI | Supabase Backend` existe somente no n8n e não é exportada para o frontend.
- `RT | CORE | ...` e o banco dos agentes ficam fora deste fluxo.

## Segredos e ambientes

`.env.local` é ignorado pelo Git. `.env.example` contém apenas nomes de variáveis e valores vazios ou públicos. Nunca colocar `service_role`, `sb_secret`, senha ou token em código, workflow exportado, documentação ou logs.

## Automação

O workflow de ingestão usa RPC transacional para normalização, deduplicação e scoring. Ele não envia WhatsApp, email, DM ou follow-up. MSW só é iniciado quando a configuração explicitamente seleciona o modo mock.

## Pendências operacionais

O Supabase Advisor recomenda habilitar proteção contra senhas comprometidas. Também há tabelas gerais da RanTech Plataforma sem policies, fora do escopo deste produto; elas não devem ser alteradas automaticamente.
