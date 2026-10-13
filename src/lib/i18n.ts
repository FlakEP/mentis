// Holt kurze Texte aus inhalte/ui.yaml in der richtigen Sprache, z. B. t('buttons.termin_anfragen').
// Reine Hilfsfunktionen ohne Astro-Abhängigkeit; die Seiten benutzen sie über uebersetzer() in src/lib/inhalte.ts.

import type { Sprache } from '../config/site';
import { ersetzeVariablen } from './text';

/** Signatur der t()-Funktion, die Komponenten benutzen. */
export type Uebersetzer = (pfad: string, werte?: Record<string, string | number>) => string;

/**
 * Sucht einen Text in der Struktur von ui.yaml.
 * Ein Eintrag ist entweder ein einfacher Text (z. B. marke.name) oder hat die Felder de und en.
 */
export function textAusBaum(baum: unknown, pfad: string, sprache: Sprache): string {
  let knoten: unknown = baum;
  for (const teil of pfad.split('.')) {
    if (knoten && typeof knoten === 'object' && teil in knoten) {
      knoten = (knoten as Record<string, unknown>)[teil];
    } else {
      throw new Error(`Text „${pfad}“ fehlt in inhalte/ui.yaml.`);
    }
  }
  if (typeof knoten === 'string') return knoten;
  if (knoten && typeof knoten === 'object' && sprache in knoten) {
    const wert = (knoten as Record<string, unknown>)[sprache];
    if (typeof wert === 'string') return wert;
  }
  throw new Error(`Text „${pfad}“ in inhalte/ui.yaml hat keine Fassung für „${sprache}“.`);
}

/** Baut eine t()-Funktion für eine Sprache. */
export function erstelleUebersetzer(baum: unknown, sprache: Sprache): Uebersetzer {
  return (pfad, werte) => ersetzeVariablen(textAusBaum(baum, pfad, sprache), werte);
}
