// Zerlegt Inhaltstexte in Teile: normaler Text, Platzhalter [[PLATZHALTER: …]] und *betonte* Wörter.
// Wird von der Komponente src/components/Text.astro und vom Platzhalter-Plugin für Markdown benutzt.

/** Findet Platzhalter wie [[PLATZHALTER: Preis ADHS-Diagnostik, z. B. 450]]. */
export const PLATZHALTER_MUSTER = /\[\[PLATZHALTER:[^\]]*\]\]/g;

/** Findet *betonte* Wörter (ein Sternchen davor und danach). */
const BETONUNG_MUSTER = /\*([^*]+)\*/g;

export type Textteil =
  | { art: 'text'; text: string }
  | { art: 'platzhalter'; text: string }
  | { art: 'betont'; text: string };

/** Enthält der Text noch einen offenen Platzhalter? */
export function enthaeltPlatzhalter(text: string): boolean {
  return new RegExp(PLATZHALTER_MUSTER.source).test(text);
}

function zerlegeNachMuster(text: string, muster: RegExp, art: 'platzhalter' | 'betont'): Textteil[] {
  const teile: Textteil[] = [];
  let letzteStelle = 0;
  for (const treffer of text.matchAll(new RegExp(muster.source, 'g'))) {
    const stelle = treffer.index ?? 0;
    if (stelle > letzteStelle) teile.push({ art: 'text', text: text.slice(letzteStelle, stelle) });
    // Bei Betonung nur das Wort ohne Sternchen übernehmen
    teile.push({ art, text: art === 'betont' ? (treffer[1] ?? '') : treffer[0] });
    letzteStelle = stelle + treffer[0].length;
  }
  if (letzteStelle < text.length) teile.push({ art: 'text', text: text.slice(letzteStelle) });
  return teile;
}

/**
 * Zerlegt einen Text in darstellbare Teile.
 * Mit `betonung: true` werden *Wörter in Sternchen* als betont erkannt
 * (z. B. das Akzentwort in der Hero-Überschrift).
 */
export function zerlegeText(text: string, { betonung = false } = {}): Textteil[] {
  const teile = zerlegeNachMuster(text, PLATZHALTER_MUSTER, 'platzhalter');
  if (!betonung) return teile;
  return teile.flatMap((teil) => (teil.art === 'text' ? zerlegeNachMuster(teil.text, BETONUNG_MUSTER, 'betont') : [teil]));
}

/** Entfernt die Sternchen der Betonung, z. B. für den Seitentitel im Browser-Tab. */
export function ohneBetonung(text: string): string {
  return text.replace(new RegExp(BETONUNG_MUSTER.source, 'g'), '$1');
}

/** Ersetzt {name}-Platzhalter in ui.yaml-Texten, z. B. {jahr} oder {aktuell}. */
export function ersetzeVariablen(text: string, werte: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (ganz, name: string) => (name in werte ? String(werte[name]) : ganz));
}
