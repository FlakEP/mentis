// Prüft alle Dateien in inhalte/ beim Start von „npm run dev“ und „npm run build“
// und erklärt Fehler auf Deutsch (Datei, Zeile, Feld, was fehlt). Eingebunden in astro.config.ts.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml, YAMLParseError } from 'yaml';
import type { z } from 'astro/zod';
import {
  kontaktSchema,
  leistungsseiteSchema,
  rechtstextSchema,
  selbsttestSchema,
  startseiteSchema,
  ueberUnsSchema,
  uiSchema,
} from './schemas';

/** Welche Datei mit welchem Schema geprüft wird (Seitendateien je Sprachordner). */
const SEITEN_SCHEMAS: Record<string, z.ZodType> = {
  'startseite.md': startseiteSchema,
  'adhs-diagnostik.md': leistungsseiteSchema,
  'intelligenzdiagnostik.md': leistungsseiteSchema,
  'klinische-diagnostik.md': leistungsseiteSchema,
  'ueber-uns.md': ueberUnsSchema,
  'kontakt.md': kontaktSchema,
  'impressum.md': rechtstextSchema,
  'datenschutz.md': rechtstextSchema,
};

const TYPNAMEN: Record<string, string> = {
  string: 'ein Text',
  number: 'eine Zahl',
  boolean: 'true oder false',
  array: 'eine Liste (Zeilen mit Bindestrich)',
  object: 'ein Abschnitt mit eingerückten Unterfeldern',
};

/** Übersetzt einen Zod-Befund in einen verständlichen deutschen Satz. */
function beschreibeBefund(befund: z.core.$ZodIssue & { input?: unknown }): string {
  switch (befund.code) {
    case 'invalid_type':
      if (befund.input === undefined) return 'Pflichtfeld fehlt.';
      return `Hier wird ${TYPNAMEN[befund.expected] ?? befund.expected} erwartet.`;
    case 'too_small':
      if (befund.origin === 'string') return 'Darf nicht leer sein.';
      if (befund.origin === 'array') return `Die Liste braucht mindestens ${befund.minimum} Einträge.`;
      return `Der Wert muss mindestens ${befund.minimum} sein.`;
    case 'too_big':
      if (befund.origin === 'array') return `Die Liste darf höchstens ${befund.maximum} Einträge haben.`;
      return `Der Wert darf höchstens ${befund.maximum} sein.`;
    case 'invalid_value':
      return `Ungültiger Wert. Erlaubt ist: ${befund.values.map(String).join(', ')}.`;
    case 'unrecognized_keys':
      return `Unbekanntes Feld „${befund.keys.join('“, „')}“ – Tippfehler oder falsche Einrückung?`;
    case 'invalid_format':
      return befund.format === 'email' ? 'Keine gültige E-Mail-Adresse.' : 'Ungültiges Format.';
    case 'invalid_union':
      return 'Hier wird eine Zahl oder ein Text erwartet.';
    default:
      return befund.message;
  }
}

function feldpfad(pfad: PropertyKey[]): string {
  if (pfad.length === 0) return '(ganze Datei)';
  return pfad.map((teil) => (typeof teil === 'number' ? `[${teil + 1}. Eintrag]` : String(teil))).join(' → ');
}

/** Liest YAML und meldet Syntaxfehler mit Zeilennummer. */
function leseYaml(inhalt: string, zeilenVersatz: number): { daten?: unknown; fehler?: string } {
  try {
    return { daten: parseYaml(inhalt) };
  } catch (fehler) {
    if (fehler instanceof YAMLParseError) {
      const zeile = (fehler.linePos?.[0]?.line ?? 0) + zeilenVersatz;
      return {
        fehler:
          `Zeile ${zeile}: Die Datei ist nicht korrekt aufgebaut (YAML). ` +
          'Häufige Ursachen: falsche Einrückung, ein fehlender Bindestrich oder ein Text mit Doppelpunkt ohne "Anführungszeichen".',
      };
    }
    throw fehler;
  }
}

function pruefeDaten(daten: unknown, schema: z.ZodType): string[] {
  const ergebnis = schema.safeParse(daten, { reportInput: true });
  if (ergebnis.success) return [];
  return ergebnis.error.issues.map((befund) => `${feldpfad(befund.path)}: ${beschreibeBefund(befund)}`);
}

/**
 * Prüft alle Inhaltsdateien und gibt eine Liste deutscher Fehlermeldungen zurück
 * (leer, wenn alles in Ordnung ist).
 */
export function pruefeInhalte(projektordner: string): string[] {
  const meldungen: string[] = [];
  const inhalte = join(projektordner, 'inhalte');
  const melde = (datei: string, fehler: string[]) => {
    if (fehler.length === 0) return;
    meldungen.push(`${relative(projektordner, datei)}\n${fehler.map((f) => `   • ${f}`).join('\n')}`);
  };

  // 1. Globale Texte
  const uiDatei = join(inhalte, 'ui.yaml');
  const ui = leseYaml(readFileSync(uiDatei, 'utf8'), 0);
  melde(uiDatei, ui.fehler ? [ui.fehler] : pruefeDaten(ui.daten, uiSchema));

  // 2. Seiten (Frontmatter zwischen den beiden ---)
  for (const sprache of ['de', 'en']) {
    const ordner = join(inhalte, 'seiten', sprache);
    if (!existsSync(ordner)) continue;
    for (const name of readdirSync(ordner).filter((n) => n.endsWith('.md'))) {
      const datei = join(ordner, name);
      const schema = SEITEN_SCHEMAS[name];
      if (!schema) {
        melde(datei, [`Unbekannte Seitendatei. Erlaubt sind: ${Object.keys(SEITEN_SCHEMAS).join(', ')}.`]);
        continue;
      }
      const treffer = readFileSync(datei, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!treffer) {
        melde(datei, ['Der Kopfbereich zwischen zwei Zeilen mit --- fehlt am Dateianfang.']);
        continue;
      }
      const kopf = leseYaml(treffer[1] ?? '', 1);
      melde(datei, kopf.fehler ? [kopf.fehler] : pruefeDaten(kopf.daten, schema));
    }
  }

  // 3. Selbsttests
  const testordner = join(inhalte, 'selbsttests');
  for (const name of readdirSync(testordner).filter((n) => n.endsWith('.yaml'))) {
    const datei = join(testordner, name);
    const test = leseYaml(readFileSync(datei, 'utf8'), 0);
    melde(datei, test.fehler ? [test.fehler] : pruefeDaten(test.daten, selbsttestSchema));
  }

  return meldungen;
}

/** Fasst die Meldungen zu einem gut lesbaren Fehlertext zusammen. */
export function fehlertext(meldungen: string[]): string {
  return (
    `\n\n${meldungen.length === 1 ? 'Eine Inhaltsdatei enthält' : `${meldungen.length} Inhaltsdateien enthalten`} Fehler:\n\n` +
    meldungen.join('\n\n') +
    '\n\nBitte die genannten Stellen korrigieren und den Befehl erneut starten.\n'
  );
}
