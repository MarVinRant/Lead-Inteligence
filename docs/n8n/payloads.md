# Payloads do Lead Intake V1

## Entrada aceita

```json
{
  "company_name": "Oficina Exemplo",
  "niche": "oficina mecânica",
  "location": "São Paulo - SP",
  "phone": "+55 11 99999-9999",
  "whatsapp": "5511999999999",
  "instagram_url": "https://instagram.com/oficina.exemplo",
  "website_url": "",
  "source": "manual",
  "source_url": ""
}
```

## Saída normalizada

Além dos campos de entrada, a função produz `dedupe_key`, `niche_family`, score, prioridade, recomendação de serviço/demo e um resultado de idempotência (`created`/`duplicate`). Telefones ficam somente com dígitos; URLs recebem protocolo e removem tracking/query. Campos ausentes permanecem `null` ou vazios. O fluxo rejeita payload sem nome, nicho ou localização e não inventa dados.
