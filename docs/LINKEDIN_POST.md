# Post para LinkedIn

Construí uma plataforma de inteligência comercial para a RanTech.

O desafio era conhecido: leads espalhados, pouca clareza sobre quais oportunidades priorizar e nenhuma memória confiável sobre o histórico ou o serviço mais adequado para cada negócio.

O resultado não é apenas um CRM. É um fluxo ponta a ponta que recebe sinais pelo n8n, normaliza e deduplica os dados, executa análise e scoring auditável, persiste tudo no Supabase e apresenta os próximos movimentos em uma interface React.

No painel, criei:

- Command Center com oportunidades que exigem atenção;
- Radar de oportunidades;
- Lead Intelligence com diagnóstico, recomendação, histórico e memória comercial;
- Pipeline Kanban;
- biblioteca de demos;
- Insights derivados dos dados atuais.

Os principais aprendizados foram implementar uma arquitetura por features e domínio, manter a UI desacoplada da fonte de dados com Repository Pattern, aplicar RLS por workspace no Supabase e tratar deduplicação e ingestão como parte de uma transação real.

Tecnologias principais: React, TypeScript, Vite, Supabase/PostgreSQL, Auth, RLS, n8n, TanStack Query, TanStack Table, dnd-kit, Vitest, React Testing Library e Playwright.

O projeto nasceu de uma necessidade real da RanTech e foi uma oportunidade de transformar um problema operacional em um produto demonstrável, com segurança, automação e uma camada de decisão comercial.

Projeto: https://referenced-chatgpt-conversation-this-is-4svl3fvgr.vercel.app

Repositório: adicionar o link do GitHub após configurar o remote público.

Feedbacks e conexões são bem-vindos — especialmente de quem trabalha com produto, automação ou engenharia de dados.

## Ordem sugerida das imagens

1. Overview / Command Center — apresenta o problema e as prioridades.
2. Radar — mostra como as oportunidades são encontradas.
3. Lead Intelligence — evidencia o diferencial de diagnóstico e memória.
4. Pipeline — mostra a operação comercial em andamento.
5. Insights — fecha a história com leitura dos dados.

## Hashtags

#React #TypeScript #Supabase #n8n #DesenvolvimentoWeb
