// Tests für die Bogen-Geometrie: Die berechneten Bögen müssen genau denen im Logo entsprechen.
import { describe, expect, it } from 'vitest';
import { bogenPaar } from './bogen';

describe('bogenPaar', () => {
  it('stimmt mit logo/bildmarke.svg überein', () => {
    expect(bogenPaar(50, 50, 38)).toEqual(['M25.07 78.68A38 38 0 0 1 62.37 14.07', 'M74.93 21.32A38 38 0 0 1 37.63 85.93']);
  });
});
