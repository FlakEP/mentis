// Zentrale Einstellungen der Website: Domain, Sprachen, Seiten-Adressen (DE/EN) und Menü.
// Wird von Header, Footer, Sprachumschalter, Sitemap und allen Seiten benutzt.

export const SITE_URL = 'https://mentis.uno';

export const SPRACHEN = ['de', 'en'] as const;
export type Sprache = (typeof SPRACHEN)[number];
export const STANDARD_SPRACHE: Sprache = 'de';

/**
 * Ist die englische Fassung schon fertig? Solange `false`, wird der
 * Sprachumschalter ausgeblendet (die englischen Seiten entstehen in Phase 5).
 * ÄNDERN: auf `true` setzen, sobald die englischen Seiten veröffentlicht werden.
 */
export const ENGLISCH_AKTIV = false;

/** Sprachen, für die Seiten gebaut werden. */
export const AKTIVE_SPRACHEN: Sprache[] = ENGLISCH_AKTIV ? ['de', 'en'] : ['de'];

/** Technische Namen aller Seiten. */
export type SeitenId =
  | 'start'
  | 'adhs'
  | 'intelligenz'
  | 'klinisch'
  | 'ueber_uns'
  | 'kontakt'
  | 'impressum'
  | 'datenschutz';

/** Die drei Leistungsbereiche (auch Werte des Feldes „Anliegen“ im Formular). */
export type Bereich = 'adhs' | 'intelligenz' | 'klinisch';
export const BEREICHE: Bereich[] = ['adhs', 'intelligenz', 'klinisch'];

/**
 * Adressen der Seiten in beiden Sprachen und die zugehörige Inhaltsdatei
 * in inhalte/seiten/<sprache>/.
 * ÄNDERN: Hier stehen die URLs. Wer eine Adresse ändert, ändert sie nur hier.
 * Alle Adressen enden mit „/“, damit jeder statische Hoster sie ohne Umleitung ausliefert.
 */
export const SEITEN: Record<SeitenId, { de: string; en: string; datei: string }> = {
  start: { de: '/', en: '/en/', datei: 'startseite' },
  adhs: { de: '/adhs-diagnostik/', en: '/en/adhd-assessment/', datei: 'adhs-diagnostik' },
  intelligenz: {
    de: '/intelligenzdiagnostik/',
    en: '/en/intelligence-assessment/',
    datei: 'intelligenzdiagnostik',
  },
  klinisch: {
    de: '/klinische-diagnostik/',
    en: '/en/clinical-assessment/',
    datei: 'klinische-diagnostik',
  },
  ueber_uns: { de: '/ueber-uns/', en: '/en/about/', datei: 'ueber-uns' },
  kontakt: { de: '/kontakt/', en: '/en/contact/', datei: 'kontakt' },
  impressum: { de: '/impressum/', en: '/en/legal-notice/', datei: 'impressum' },
  datenschutz: { de: '/datenschutz/', en: '/en/privacy/', datei: 'datenschutz' },
};

/**
 * Reihenfolge der Hauptnavigation im Header.
 * „Start“ fehlt bewusst: Das Logo führt zur Startseite.
 * ÄNDERN: Reihenfolge der Menüpunkte hier anpassen.
 */
export const HAUPTNAVIGATION: SeitenId[] = ['adhs', 'intelligenz', 'klinisch', 'ueber_uns', 'kontakt'];

/** Anker (Sprungmarken) innerhalb der Seiten. */
export const ANKER = {
  selbsteinschaetzung: 'selbsteinschaetzung',
  kosten: 'kosten',
  kontakt: 'kontakt',
} as const;

/** Adresse einer Seite in der gewünschten Sprache. */
export function seitenUrl(id: SeitenId, sprache: Sprache): string {
  return SEITEN[id][sprache];
}

/** Adresse der Kontaktseite mit vorausgewähltem Anliegen (funktioniert auch ohne JavaScript). */
export function kontaktUrl(sprache: Sprache, anliegen?: string): string {
  const basis = seitenUrl('kontakt', sprache);
  return anliegen ? `${basis}?anliegen=${encodeURIComponent(anliegen)}` : basis;
}
