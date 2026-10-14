// Zugriff auf die Inhalte aus inhalte/ für Seiten und Komponenten (globale Texte, Seiten, Preise).
// Alle Funktionen laufen beim Bauen der Seite, nicht im Browser.

import { getEntry } from 'astro:content';
import { BEREICHE, SEITEN, type Bereich, type Sprache } from '../config/site';
import { erstelleUebersetzer, type Uebersetzer } from './i18n';

/** t()-Funktion für eine Sprache, z. B. t('buttons.termin_anfragen'). */
export async function uebersetzer(sprache: Sprache): Promise<Uebersetzer> {
  const ui = await getEntry('ui', 'ui');
  if (!ui) throw new Error('inhalte/ui.yaml konnte nicht geladen werden.');
  return erstelleUebersetzer(ui.data, sprache);
}

function fehlt(datei: string, sprache: Sprache): never {
  throw new Error(`Die Datei inhalte/seiten/${sprache}/${datei}.md fehlt.`);
}

export async function holeStartseite(sprache: Sprache) {
  return (await getEntry('startseite', `${sprache}/startseite`)) ?? fehlt('startseite', sprache);
}

export async function holeLeistungsseite(bereich: Bereich, sprache: Sprache) {
  const datei = SEITEN[bereich].datei;
  return (await getEntry('leistungsseiten', `${sprache}/${datei}`)) ?? fehlt(datei, sprache);
}

export async function holeUeberUns(sprache: Sprache) {
  return (await getEntry('ueberUns', `${sprache}/ueber-uns`)) ?? fehlt('ueber-uns', sprache);
}

export async function holeRechtstext(art: 'impressum' | 'datenschutz', sprache: Sprache) {
  return (await getEntry('rechtstexte', `${sprache}/${art}`)) ?? fehlt(art, sprache);
}

/** Die beiden Fragebögen einer Leistungsseite (in der Reihenfolge aus dem Frontmatter). */
export async function holeSelbsttests(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      const test = await getEntry('selbsttests', id);
      if (!test) throw new Error(`Der Fragebogen inhalte/selbsttests/${id}.yaml fehlt.`);
      return test.data;
    }),
  );
}

export async function holeKontaktseite(sprache: Sprache) {
  return (await getEntry('kontakt', `${sprache}/kontakt`)) ?? fehlt('kontakt', sprache);
}

/** Preise und Dauer aller drei Leistungen – automatisch aus den Leistungsseiten gelesen. */
export async function holePreise(sprache: Sprache) {
  return Promise.all(
    BEREICHE.map(async (bereich) => {
      const seite = await holeLeistungsseite(bereich, sprache);
      return { bereich, preisAb: seite.data.preis_ab, dauer: seite.data.dauer };
    }),
  );
}

/** Kontaktdaten (E-Mail, Ort …) aus der Kontaktseite, z. B. für den Footer. */
export async function holeKontaktdaten(sprache: Sprache) {
  return (await holeKontaktseite(sprache)).data.kontaktdaten;
}
