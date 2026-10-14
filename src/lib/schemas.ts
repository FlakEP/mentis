// Prüfregeln (Zod-Schemas) für alle Dateien in inhalte/: welche Felder es gibt und welche Pflicht sind.
// Benutzt von src/content.config.ts (Astro) und src/lib/inhalte-pruefen.ts (deutsche Fehlermeldungen beim Start).
// ÄNDERN: Wer in einer Inhaltsdatei ein neues Feld einführt, ergänzt es hier im passenden Schema.

import { z } from 'astro/zod';

/* ---------- Bausteine ---------- */

/** Ein Text, der nicht leer sein darf. */
const text = z.string().trim().min(1);

/** Ein Text, der leer bleiben darf (z. B. Telefonnummer). */
const optionalerText = z.string().default('');

/** Ein Text in beiden Sprachen. */
const zweisprachig = z.strictObject({ de: text, en: text });

/** Ein Text in beiden Sprachen, der leer sein darf (z. B. „zeitraum“ bei den Intelligenz-Tests). */
const zweisprachigOptional = z.strictObject({ de: z.string(), en: z.string() });

/** Preis: eine Zahl oder ein Platzhalter. */
const preis = z.union([z.number(), text]).transform((wert) => String(wert));

const bereich = z.enum(['adhs', 'intelligenz', 'klinisch']);

const seitenkopf = z.strictObject({
  ueberschrift: text,
  unterzeile: text,
});

/** Felder, die jede Seite hat. */
const seitenBasis = {
  seitentitel: text,
  beschreibung: text,
  noindex: z.boolean().default(false),
};

/* ---------- Seiten (inhalte/seiten/de|en/*.md) ---------- */

export const startseiteSchema = z.strictObject({
  ...seitenBasis,
  hero: z.strictObject({ ueberschrift: text, unterzeile: text }),
  leistungen: z.strictObject({
    ueberschrift: text,
    karten: z.array(z.strictObject({ titel: text, text, link: bereich })).min(1),
  }),
  ablauf: z.strictObject({
    ueberschrift: text,
    schritte: z.array(z.strictObject({ titel: text, text })).min(1),
  }),
  gutachten: z.strictObject({ ueberschrift: text, text, button: text }),
  selbsttests_teaser: z.strictObject({ ueberschrift: text, text }),
  kosten: z.strictObject({ ueberschrift: text }),
});

export const leistungsseiteSchema = z.strictObject({
  ...seitenBasis,
  selbsttests: z.array(text).length(2),
  preis_ab: preis,
  dauer: text,
  krisenhinweis_anzeigen: z.boolean().default(false),
  einstieg: seitenkopf,
});

export const ueberUnsSchema = z.strictObject({
  ...seitenBasis,
  einstieg: seitenkopf,
  personen: z
    .array(
      z.strictObject({
        name: text,
        initialen: text,
        berufsbezeichnung: text,
        foto: z.string().optional(),
        stationen: z.array(z.strictObject({ zeitraum: text, text })).min(1),
        erfahrung: text,
        diagnostik: text,
      }),
    )
    .min(1),
});

export const kontaktSchema = z.strictObject({
  ...seitenBasis,
  einstieg: seitenkopf,
  kontaktdaten: z.strictObject({
    email: z.email(),
    telefon: optionalerText,
    ort: text,
    termine: text,
  }),
});

export const rechtstextSchema = z.strictObject({
  ...seitenBasis,
  stand: text.optional(),
});

/* ---------- Globale Texte (inhalte/ui.yaml) ---------- */

export const uiSchema = z.strictObject({
  marke: z.strictObject({ name: text, unterzeile: zweisprachig, leitsatz: zweisprachig }),
  navigation: z.strictObject({
    start: zweisprachig,
    adhs: zweisprachig,
    intelligenz: zweisprachig,
    klinisch: zweisprachig,
    ueber_uns: zweisprachig,
    kontakt: zweisprachig,
    impressum: zweisprachig,
    datenschutz: zweisprachig,
    sprache_wechseln: zweisprachig,
    menue_oeffnen: zweisprachig,
    menue_schliessen: zweisprachig,
    hauptmenue: zweisprachig,
    zum_inhalt: zweisprachig,
    auf_dieser_seite: zweisprachig,
  }),
  buttons: z.strictObject({
    termin_anfragen: zweisprachig,
    selbsttest_starten: zweisprachig,
    mehr_erfahren: zweisprachig,
    weiter: zweisprachig,
    zurueck: zweisprachig,
    auswerten: zweisprachig,
    neu_starten: zweisprachig,
    schliessen: zweisprachig,
  }),
  selbstzahler: z.strictObject({ kurz: zweisprachig, lang: zweisprachig }),
  preise: z.strictObject({ ueberschrift: zweisprachig, ab: zweisprachig, hinweis: zweisprachig }),
  selbsttest: z.strictObject({
    ueberschrift: zweisprachig,
    auswahl_frage: zweisprachig,
    auswahl_selbst: zweisprachig,
    auswahl_fremd: zweisprachig,
    hinweis_vorab: zweisprachig,
    fortschritt: zweisprachig,
    ergebnis_ueberschrift: zweisprachig,
    hinweis_ergebnis: zweisprachig,
    cta_text: zweisprachig,
  }),
  krisenhinweis: z.strictObject({ ueberschrift: zweisprachig, text: zweisprachig }),
  kontaktformular: z.strictObject({
    ueberschrift: zweisprachig,
    einleitung: zweisprachig,
    name: zweisprachig,
    email: zweisprachig,
    telefon: zweisprachig,
    anliegen: zweisprachig,
    anliegen_optionen: z.strictObject({
      adhs: zweisprachig,
      intelligenz: zweisprachig,
      klinisch: zweisprachig,
      gutachten: zweisprachig,
      sonstiges: zweisprachig,
    }),
    rueckruf: zweisprachig,
    rueckruf_optionen: z.strictObject({
      egal: zweisprachig,
      vormittags: zweisprachig,
      nachmittags: zweisprachig,
      abends: zweisprachig,
    }),
    nachricht: zweisprachig,
    nachricht_hinweis: zweisprachig,
    einwilligung: zweisprachig,
    datenschutz_linktext: zweisprachig,
    pflichtfeld: zweisprachig,
    absenden: zweisprachig,
    sendet: zweisprachig,
    erfolg: zweisprachig,
    fehler: zweisprachig,
    direkt_email: zweisprachig,
  }),
  footer: z.strictObject({ kurzbeschreibung: zweisprachig, termine: zweisprachig, copyright: zweisprachig }),
  rechtstexte: z.strictObject({ stand: zweisprachig }),
  hinweis_englisch: z.strictObject({ en: text }),
});

export type UiTexte = z.infer<typeof uiSchema>;

/* ---------- Selbsttests (inhalte/selbsttests/*.yaml) ---------- */
// Die inhaltlichen Zusatzprüfungen (Skalen vorhanden, IDs eindeutig, Schwellenwerte
// steigend …) kommen in Phase 3 hinzu.

const antwort = z.strictObject({ wert: z.number().int().min(0), de: text, en: text });

export const selbsttestSchema = z.strictObject({
  id: text,
  bereich,
  perspektive: z.enum(['selbst', 'fremd']),
  krisenhinweis: z.boolean(),
  titel: zweisprachig,
  zielgruppe: zweisprachig,
  einleitung: zweisprachig,
  zeitraum: zweisprachigOptional,
  standardskala: text,
  fragen: z.array(z.strictObject({ id: text, skala: text.optional(), de: text, en: text })).min(1),
  auswertung: z.strictObject({
    stufen: z
      .array(z.strictObject({ id: text, max_summe: z.number().int().min(0), titel: zweisprachig, text: zweisprachig }))
      .min(1),
    hochstufen: z.array(
      z.strictObject({ fragen: z.array(text).min(1), ab_wert: z.number().int().min(0), mindeststufe: text }),
    ),
  }),
  skalen: z.record(z.string(), z.array(antwort).min(2)),
});

export type Selbsttest = z.infer<typeof selbsttestSchema>;
