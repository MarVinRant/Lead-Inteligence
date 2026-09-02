import { describe, expect, it } from 'vitest';
import { scoreTone } from './score';
describe('scoreTone', () => {
  it('classifies commercial priority bands', () => {
    expect(scoreTone(94)).toBe('hot');
    expect(scoreTone(76)).toBe('warm');
    expect(scoreTone(42)).toBe('cool');
  });
});
