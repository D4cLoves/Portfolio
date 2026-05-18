import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

describe('Testing framework setup', () => {
  it('vitest runs correctly', () => {
    expect(true).toBe(true);
  });

  it('jsdom environment is available', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello';
    expect(div.textContent).toBe('Hello');
  });

  it('fast-check is available', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return typeof n === 'number';
      })
    );
  });
});
