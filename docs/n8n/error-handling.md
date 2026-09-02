# Tratamento de erros

O contrato do Marco D1 separa payload inválido, duplicidade, falha de fonte externa, falha no Supabase, falha de análise e erro inesperado. Cada erro deve preservar o payload mínimo de diagnóstico, gerar evento técnico quando possível e retornar uma resposta identificável ao chamador.

Payload inválido gera erro identificável pela função (`22023`); falhas de persistência/análise/scoring propagam erro ao n8n para a execução ficar visível como falha. Nenhum erro dispara contato automático. O workflow de Error Handler permanece pendente até existir um contrato operacional de alertas, sem criar contato comercial.
