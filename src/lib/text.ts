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

/**
 * Findet Telefonnummern in Hilfetexten (z. B. 112, 116 123, 0800 111 0 111),
 * damit sie auf dem Handy direkt angetippt werden können. Benutzt im Krisenhinweis.
 */
const TELEFON_MUSTER = /(?<!\d ?)(?:0800(?: \d+){2,3}|116 \d{3}|112)(?![\d])/g;

export type Telefonteil = { art: 'text'; text: string } | { art: 'telefon'; text: string; nummer: string };

export function findeTelefonnummern(text: string): Telefonteil[] {
  const teile: Telefonteil[] = [];
  let letzteStelle = 0;
  for (const treffer of text.matchAll(TELEFON_MUSTER)) {
    const stelle = treffer.index ?? 0;
    if (stelle > letzteStelle) teile.push({ art: 'text', text: text.slice(letzteStelle, stelle) });
    teile.push({ art: 'telefon', text: treffer[0], nummer: treffer[0].replace(/\s/g, '') });
    letzteStelle = stelle + treffer[0].length;
  }
  if (letzteStelle < text.length) teile.push({ art: 'text', text: text.slice(letzteStelle) });
  return teile;
}
