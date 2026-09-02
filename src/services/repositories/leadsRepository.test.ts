import { describe, expect, it } from 'vitest';
import { leadsRepository } from './leadsRepository';
describe('leadsRepository', () => {
  it('returns the seeded lead universe and resolves a dossier by id', async () => {
    const leads = await leadsRepository.list();
    expect(leads.length).toBeGreaterThanOrEqual(5);
    expect((await leadsRepository.getById('lead-001'))?.company).toBe('Oficina Torque Norte');
  });
});
