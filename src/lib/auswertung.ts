// Auswertung der Selbsteinschätzungen (reine Funktionen, ohne Speicherung) und inhaltliche Prüfung der Fragebögen.
// Läuft im Browser (src/scripts/selbsttest.ts) und beim Bauen (src/lib/inhalte-pruefen.ts); getestet in auswertung.test.ts.

/** Der Teil eines Fragebogens, den die Auswertung braucht (Aufbau wie in inhalte/selbsttests/*.yaml). */
export interface Auswertbar {
  standardskala: string;
  fragen: { id: string; skala?: string }[];
  auswertung: {
    stufen: { id: string; max_summe: number }[];
    hochstufen: { fragen: string[]; ab_wert: number; mindeststufe: string }[];
  };
  skalen: Record<string, { wert: number }[]>;
}

/** Antworten: Fragen-ID → gewählter Wert. Lebt nur in einer Variablen im Browser. */
export type Antworten = Record<string, number>;

/** Name der Skala, die für eine Frage gilt (eigene „skala“ oder „standardskala“). */
export function skalaVon(test: Auswertbar, frage: { skala?: string }): string {
  return frage.skala ?? test.standardskala;
}

/** Höchste erreichbare Summe (jede Frage mit ihrer höchsten Antwort). */
export function maximaleSumme(test: Auswertbar): number {
  return test.fragen.reduce((summe, frage) => {
    const werte = (test.skalen[skalaVon(test, frage)] ?? []).map((antwort) => antwort.wert);
    return summe + (werte.length ? Math.max(...werte) : 0);
  }, 0);
}

/** Sind alle Fragen beantwortet? Nur dann darf ein Ergebnis erscheinen. */
export function alleBeantwortet(test: Auswertbar, antworten: Antworten): boolean {
  return test.fragen.every((frage) => typeof antworten[frage.id] === 'number');
}

/**
 * Ermittelt die Ergebnisstufe (siehe Spezifikation 8.3):
 * 1. Summe aller Werte → erste Stufe, deren max_summe nicht überschritten wird.
 * 2. Hochstufungsregeln: Hat mindestens eine der genannten Fragen einen Wert ≥ ab_wert,
 *    gilt mindestens die genannte Stufe.
 * Gibt `null` zurück, solange nicht alle Fragen beantwortet sind.
 */
export function ermittleStufe(test: Auswertbar, antworten: Antworten): string | null {
  if (!alleBeantwortet(test, antworten)) return null;
  const stufen = test.auswertung.stufen;
  const summe = test.fragen.reduce((gesamt, frage) => gesamt + (antworten[frage.id] ?? 0), 0);

  let index = stufen.findIndex((stufe) => summe <= stufe.max_summe);
  if (index === -1) index = stufen.length - 1;

  for (const regel of test.auswertung.hochstufen) {
    const greift = regel.fragen.some((id) => (antworten[id] ?? 0) >= regel.ab_wert);
    const mindestens = stufen.findIndex((stufe) => stufe.id === regel.mindeststufe);
    if (greift && mindestens > index) index = mindestens;
  }
  return stufen[index]?.id ?? null;
}

/**
 * Prüft einen Fragebogen auf inhaltliche Fehler, die das Schema allein nicht erkennt.
 * Gibt verständliche deutsche Meldungen zurück (leer = alles in Ordnung).
 */
export function pruefeFragebogen(test: Auswertbar): string[] {
  const fehler: string[] = [];
  const skalen = Object.keys(test.skalen);

  if (!test.skalen[test.standardskala]) {
    fehler.push(`standardskala: Die Skala „${test.standardskala}“ gibt es unter „skalen“ nicht (vorhanden: ${skalen.join(', ')}).`);
  }

  const gesehen = new Set<string>();
  for (const frage of test.fragen) {
    if (gesehen.has(frage.id)) fehler.push(`fragen: Die ID „${frage.id}“ kommt mehrfach vor. Jede Frage braucht eine eigene ID.`);
    gesehen.add(frage.id);
    if (frage.skala && !test.skalen[frage.skala]) {
      fehler.push(`fragen → ${frage.id}: Die Skala „${frage.skala}“ gibt es unter „skalen“ nicht.`);
    }
  }

  const stufenIds = test.auswertung.stufen.map((stufe) => stufe.id);
  for (const regel of test.auswertung.hochstufen) {
    for (const id of regel.fragen) {
      if (!gesehen.has(id)) fehler.push(`auswertung → hochstufen: Die Frage „${id}“ gibt es nicht.`);
    }
    if (!stufenIds.includes(regel.mindeststufe)) {
      fehler.push(`auswertung → hochstufen: Die Stufe „${regel.mindeststufe}“ gibt es nicht (vorhanden: ${stufenIds.join(', ')}).`);
    }
  }

  const stufen = test.auswertung.stufen;
  stufen.forEach((stufe, index) => {
    const vorige = stufen[index - 1];
    if (vorige && stufe.max_summe <= vorige.max_summe) {
      fehler.push(
        `auswertung → stufen: „max_summe“ muss von Stufe zu Stufe steigen („${vorige.id}“: ${vorige.max_summe}, „${stufe.id}“: ${stufe.max_summe}).`,
      );
    }
  });

  const letzte = stufen[stufen.length - 1];
  const maximum = maximaleSumme(test);
  if (letzte && letzte.max_summe !== maximum) {
    fehler.push(
      `auswertung → stufen: Die letzte Stufe („${letzte.id}“) muss max_summe ${maximum} haben – das ist die höchste erreichbare Summe (eingetragen: ${letzte.max_summe}).`,
    );
  }

  return fehler;
}
