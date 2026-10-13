// Verbindet die Inhaltsdateien aus inhalte/ mit Astro (Content Collections).
// Die Texte bleiben in inhalte/ – hier wird nur festgelegt, welche Datei zu welcher Sammlung gehört.

import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';
import {
  kontaktSchema,
  leistungsseiteSchema,
  rechtstextSchema,
  selbsttestSchema,
  startseiteSchema,
  ueberUnsSchema,
  uiSchema,
} from './lib/schemas';

const SEITEN = './inhalte/seiten';

// Globale Texte: die ganze Datei ui.yaml ist ein einziger Eintrag mit der ID „ui“.
const ui = defineCollection({
  loader: file('./inhalte/ui.yaml', { parser: (inhalt) => ({ ui: parseYaml(inhalt) }) }),
  schema: uiSchema,
});

// Seiten: je Seitentyp eine Sammlung, jeweils für Deutsch und Englisch (IDs wie „de/startseite“).
const startseite = defineCollection({
  loader: glob({ pattern: '*/startseite.md', base: SEITEN }),
  schema: startseiteSchema,
});

const leistungsseiten = defineCollection({
  loader: glob({
    pattern: ['*/adhs-diagnostik.md', '*/intelligenzdiagnostik.md', '*/klinische-diagnostik.md'],
    base: SEITEN,
  }),
  schema: leistungsseiteSchema,
});

const ueberUns = defineCollection({
  loader: glob({ pattern: '*/ueber-uns.md', base: SEITEN }),
  schema: ueberUnsSchema,
});

const kontakt = defineCollection({
  loader: glob({ pattern: '*/kontakt.md', base: SEITEN }),
  schema: kontaktSchema,
});

const rechtstexte = defineCollection({
  loader: glob({ pattern: ['*/impressum.md', '*/datenschutz.md'], base: SEITEN }),
  schema: rechtstextSchema,
});

// Selbsttests: eine YAML-Datei pro Fragebogen (IDs wie „adhs-selbst“).
const selbsttests = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './inhalte/selbsttests' }),
  schema: selbsttestSchema,
});

export const collections = { ui, startseite, leistungsseiten, ueberUns, kontakt, rechtstexte, selbsttests };
