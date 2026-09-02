import { describe, expect, it } from 'vitest';
import { leadsRepository } from './leadsRepository';
describe('lead mutations through the repository contract', () => {
  it('creates and updates a lead through MSW-backed requests', async () => {
    const created = await leadsRepository.create({ company: 'Teste Interativo', city: 'São Paulo, SP', score: 81 });
    expect(created.company).toBe('Teste Interativo');
    const updated = await leadsRepository.update(created.id, { stage: 'Interessado', nextAction: 'Enviar proposta' });
    expect(updated.stage).toBe('Interessado');
    expect(updated.nextAction).toBe('Enviar proposta');
  });
});
