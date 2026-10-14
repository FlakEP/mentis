// Hauptkonfiguration von Astro: statische Ausgabe, Sprachen (DE ohne Präfix, EN unter /en/),
// Sitemap, Markdown-Erweiterungen und die deutsche Prüfung der Inhaltsdateien beim Start.

import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { fileURLToPath } from 'node:url';
import { AKTIVE_SPRACHEN, SITE_URL, SEITEN } from './src/config/site';
import { fehlertext, pruefeInhalte } from './src/lib/inhalte-pruefen';
import { rehypePlatzhalterMarkieren, remarkKommentareEntfernen, remarkZeilenumbrueche } from './src/lib/markdown-plugins';

/** Zu jeder Adresse die Adressen derselben Seite in allen Sprachen (für hreflang in der Sitemap). */
const SPRACHVERSIONEN = new Map(
  Object.values(SEITEN).flatMap((seite) =>
    AKTIVE_SPRACHEN.map((sprache) => [
      seite[sprache],
      AKTIVE_SPRACHEN.map((andere) => ({ lang: andere, url: new URL(seite[andere], SITE_URL).href })),
    ]),
  ),
);

/** Seiten, die nicht in der Sitemap stehen sollen (sie haben außerdem „noindex“). */
const NICHT_IN_SITEMAP = [SEITEN.impressum, SEITEN.datenschutz].flatMap((seite) => [seite.de, seite.en]);

/**
 * Prüft beim Start alle Dateien in inhalte/ und bricht den Build mit einer
 * verständlichen deutschen Fehlermeldung ab. Im Entwicklungsmodus erscheinen
 * die Fehler im Terminal, der Server läuft weiter.
 */
function inhalteIntegration(): AstroIntegration {
  return {
    name: 'mentis-inhalte',
    hooks: {
      'astro:config:setup': ({ command, config, logger }) => {
        const meldungen = pruefeInhalte(fileURLToPath(config.root));
        if (meldungen.length === 0) return;
        if (command === 'dev') logger.error(fehlertext(meldungen));
        else throw new Error(fehlertext(meldungen));
      },
    },
  };
}

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkKommentareEntfernen, remarkZeilenumbrueche],
      rehypePlugins: [rehypePlatzhalterMarkieren],
      // Keine automatischen englischen Anführungszeichen in deutschen Texten
      smartypants: false,
    }),
  },
  integrations: [
    inhalteIntegration(),
    sitemap({
      filter: (seite) => !NICHT_IN_SITEMAP.some((pfad) => new URL(seite).pathname === pfad),
      // Deutsche und englische Fassung einer Seite haben unterschiedliche Adressen,
      // deshalb werden die Sprachverweise (hreflang) aus src/config/site.ts gesetzt.
      serialize: (eintrag) => {
        const links = SPRACHVERSIONEN.get(new URL(eintrag.url).pathname);
        return links && links.length > 1 ? { ...eintrag, links } : eintrag;
      },
    }),
  ],
  // Keine Telemetrie-Hinweise, keine Vorab-Ladeskripte von außen
  prefetch: false,
});
