// Tests für die Prüfung der Inhaltsdateien: Die echten Dateien sind gültig, Fehler werden auf Deutsch gemeldet.
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { pruefeInhalte } from './inhalte-pruefen';
import { startseiteSchema } from './schemas';

describe('Inhaltsdateien', () => {
  it('alle Dateien in inhalte/ sind gültig', () => {
    expect(pruefeInhalte(fileURLToPath(new URL('../../', import.meta.url)))).toEqual([]);
  });

  it('ein fehlendes Pflichtfeld wird erkannt', () => {
    expect(startseiteSchema.safeParse({ seitentitel: 'x' }).success).toBe(false);
  });
});
