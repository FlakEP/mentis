// Tests der Auswertung für alle sechs Fragebögen in inhalte/selbsttests/ (Spezifikation 8.4):
// alles 0 → erste Stufe, alles Maximum → letzte Stufe, Grenzwerte (genau max_summe und +1) und jede Hochstufungsregel.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { selbsttestSchema, type Selbsttest } from './schemas';
import { alleBeantwortet, ermittleStufe, maximaleSumme, pruefeFragebogen, skalaVon, type Antworten } from './auswertung';

const ORDNER = fileURLToPath(new URL('../../inhalte/selbsttests/', import.meta.url));
const dateien = readdirSync(ORDNER).filter((name) => name.endsWith('.yaml'));

function lade(name: string): Selbsttest {
  return selbsttestSchema.parse(parseYaml(readFileSync(join(ORDNER, name), 'utf8')));
}

const hoechsterWert = (test: Selbsttest, id: string) => {
  const frage = test.fragen.find((f) => f.id === id)!;
  return Math.max(...test.skalen[skalaVon(test, frage)]!.map((a) => a.wert));
};

const alleMit = (test: Selbsttest, wert: (id: string) => number): Antworten =>
  Object.fromEntries(test.fragen.map((frage) => [frage.id, wert(frage.id)]));

/**
 * Baut Antworten mit genau dieser Summe, ohne eine Hochstufungsregel auszulösen:
 * Zuerst werden Fragen ohne Regel gefüllt, danach Regel-Fragen höchstens bis knapp unter ab_wert.
 */
function antwortenMitSumme(test: Selbsttest, summe: number): Antworten {
  const grenze = new Map<string, number>();
  for (const regel of test.auswertung.hochstufen) {
    for (const id of regel.fragen) grenze.set(id, Math.min(grenze.get(id) ?? Infinity, regel.ab_wert - 1));
  }
  const reihenfolge = [...test.fragen].sort((a, b) => Number(grenze.has(a.id)) - Number(grenze.has(b.id)));
  const antworten: Antworten = alleMit(test, () => 0);
  let rest = summe;
  for (const frage of reihenfolge) {
    const wert = Math.min(rest, hoechsterWert(test, frage.id), grenze.get(frage.id) ?? Infinity);
    antworten[frage.id] = wert;
    rest -= wert;
  }
  if (rest !== 0) throw new Error(`Summe ${summe} ist in ${test.titel.de} ohne Hochstufung nicht erreichbar.`);
  return antworten;
}

it('es gibt sechs Fragebögen', () => {
  expect(dateien).toHaveLength(6);
});

describe.each(dateien)('%s', (name) => {
  const test = lade(name);
  const stufen = test.auswertung.stufen;
  const erste = stufen[0]!.id;
  const letzte = stufen[stufen.length - 1]!.id;

  it('ist inhaltlich stimmig (Skalen, IDs, Schwellenwerte)', () => {
    expect(pruefeFragebogen(test)).toEqual([]);
  });

  it('alles 0 → erste Stufe', () => {
    expect(ermittleStufe(test, alleMit(test, () => 0))).toBe(erste);
  });

  it('alles Maximum → letzte Stufe', () => {
    expect(ermittleStufe(test, alleMit(test, (id) => hoechsterWert(test, id)))).toBe(letzte);
  });

  it('ohne alle Antworten gibt es kein Ergebnis', () => {
    const antworten = alleMit(test, () => 0);
    delete antworten[test.fragen[0]!.id];
    expect(alleBeantwortet(test, antworten)).toBe(false);
    expect(ermittleStufe(test, antworten)).toBeNull();
  });

  stufen.slice(0, -1).forEach((stufe, index) => {
    it(`Grenzwert: Summe ${stufe.max_summe} → „${stufe.id}“, Summe ${stufe.max_summe + 1} → „${stufen[index + 1]!.id}“`, () => {
      expect(ermittleStufe(test, antwortenMitSumme(test, stufe.max_summe))).toBe(stufe.id);
      expect(ermittleStufe(test, antwortenMitSumme(test, stufe.max_summe + 1))).toBe(stufen[index + 1]!.id);
    });
  });

  test.auswertung.hochstufen.forEach((regel) => {
    const ziel = stufen.findIndex((s) => s.id === regel.mindeststufe);
    regel.fragen.forEach((id) => {
      it(`Hochstufung: „${id}“ ≥ ${regel.ab_wert} → mindestens „${regel.mindeststufe}“`, () => {
        const ausgeloest = alleMit(test, (frage) => (frage === id ? regel.ab_wert : 0));
        const stufe = ermittleStufe(test, ausgeloest);
        expect(stufen.findIndex((s) => s.id === stufe)).toBeGreaterThanOrEqual(ziel);

        const knappDarunter = alleMit(test, (frage) => (frage === id ? regel.ab_wert - 1 : 0));
        expect(ermittleStufe(test, knappDarunter)).toBe(erste);
      });
    });
  });
});

describe('pruefeFragebogen erkennt Fehler', () => {
  const basis = lade('adhs-selbst.yaml');

  it('fehlende Skala, doppelte ID, unbekannte Stufe, falsche Schwellen', () => {
    const kaputt: Selbsttest = structuredClone(basis);
    kaputt.fragen[1]!.id = kaputt.fragen[0]!.id;
    kaputt.fragen[2]!.skala = 'gibtsnicht';
    kaputt.auswertung.hochstufen = [{ fragen: ['zz'], ab_wert: 2, mindeststufe: 'hoch' }];
    kaputt.auswertung.stufen[1]!.max_summe = 3;
    const meldungen = pruefeFragebogen(kaputt).join('\n');
    expect(meldungen).toContain('mehrfach');
    expect(meldungen).toContain('„gibtsnicht“');
    expect(meldungen).toContain('Frage „zz“');
    expect(meldungen).toContain('Stufe „hoch“');
    expect(meldungen).toContain('muss von Stufe zu Stufe steigen');
  });

  it('letzte Stufe muss die höchste erreichbare Summe sein', () => {
    const kaputt: Selbsttest = structuredClone(basis);
    kaputt.auswertung.stufen[2]!.max_summe = 30;
    expect(pruefeFragebogen(kaputt).join('\n')).toContain(`max_summe ${maximaleSumme(basis)}`);
  });
});
