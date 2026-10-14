// Bedienung der Selbsteinschätzungen im Browser (gehört zu src/components/Selbsttest.astro).
// Eine Frage pro Schritt, Fortschrittsanzeige, Zurück/Weiter, Ergebnis über src/lib/auswertung.ts.
// Datenschutz: Die Antworten liegen nur in einer Variablen. Kein localStorage, keine Cookies, keine Übertragung.

import { alleBeantwortet, ermittleStufe, type Antworten, type Auswertbar } from '../lib/auswertung';
import { ersetzeVariablen } from '../lib/text';

/** Verzögerung, bevor nach einer Antwort per Maus/Finger automatisch weitergeblättert wird. */
const AUTOMATISCH_WEITER_MS = 250;

/** Scrollt einen Bereich ins Bild, falls er oben unter dem Header oder unten außerhalb liegt. */
function zeigeImBild(element: HTMLElement) {
  const kopf = document.querySelector<HTMLElement>('[data-kopf]')?.getBoundingClientRect().bottom ?? 0;
  const lage = element.getBoundingClientRect();
  if (lage.top < kopf || lage.top > window.innerHeight * 0.6) {
    const sanft = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    element.scrollIntoView({ block: 'start', behavior: sanft ? 'smooth' : 'auto' });
  }
}

function richteFragebogenEin(test: HTMLElement, ansagen: (text: string) => void, vorlage: string) {
  const daten = JSON.parse(test.querySelector('[data-auswertung]')?.textContent ?? '{}') as Auswertbar;
  const fragen = [...test.querySelectorAll<HTMLFieldSetElement>('[data-frage]')];
  const ablauf = test.querySelector<HTMLElement>('[data-ablauf]')!;
  const ergebnis = test.querySelector<HTMLElement>('[data-ergebnis]')!;
  const zurueck = test.querySelector<HTMLButtonElement>('[data-zurueck]')!;
  const weiter = test.querySelector<HTMLButtonElement>('[data-weiter]')!;
  const auswerten = test.querySelector<HTMLButtonElement>('[data-auswerten]')!;
  const fortschrittText = test.querySelector<HTMLElement>('[data-fortschritt-text]')!;
  const fortschrittBalken = test.querySelector<HTMLElement>('[data-fortschritt-balken]')!;

  let antworten: Antworten = {};
  let aktuell = 0;
  let perZeiger = false; // Wurde die letzte Antwort mit Maus oder Finger gewählt?
  let zeitgeber: number | undefined;

  const fortschritt = (index: number) => ersetzeVariablen(vorlage, { aktuell: index + 1, gesamt: fragen.length });

  function aktualisiereKnoepfe() {
    const frage = fragen[aktuell];
    const beantwortet = frage ? typeof antworten[frage.dataset.frage ?? ''] === 'number' : false;
    const letzte = aktuell === fragen.length - 1;
    zurueck.disabled = aktuell === 0;
    weiter.hidden = letzte;
    weiter.disabled = !beantwortet;
    auswerten.hidden = !letzte;
    auswerten.disabled = !alleBeantwortet(daten, antworten);
  }

  function zeigeFrage(index: number, { fokus = true } = {}) {
    window.clearTimeout(zeitgeber);
    aktuell = index;
    fragen.forEach((frage, i) => (frage.hidden = i !== index));
    fortschrittText.textContent = fortschritt(index);
    fortschrittBalken.style.width = `${((index + 1) / fragen.length) * 100}%`;
    aktualisiereKnoepfe();
    if (fokus) {
      fragen[index]?.focus({ preventScroll: true });
      zeigeImBild(ablauf);
      ansagen(fortschritt(index));
    }
  }

  function zeigeErgebnis() {
    const stufe = ermittleStufe(daten, antworten);
    if (!stufe) return;
    ablauf.hidden = true;
    ergebnis.hidden = false;
    ergebnis.querySelectorAll<HTMLElement>('[data-stufe]').forEach((block) => (block.hidden = block.dataset.stufe !== stufe));
    ergebnis.querySelector<HTMLElement>('[data-ergebnis-titel]')?.focus({ preventScroll: true });
    zeigeImBild(ergebnis);
    const titel = ergebnis.querySelector<HTMLElement>(`[data-stufe="${stufe}"] h4`)?.textContent ?? '';
    ansagen(titel);
  }

  /** Setzt den Fragebogen auf Anfang zurück (alle Antworten werden vergessen). */
  function neuStarten({ fokus = true } = {}) {
    antworten = {};
    test.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((feld) => (feld.checked = false));
    ergebnis.hidden = true;
    ablauf.hidden = false;
    zeigeFrage(0, { fokus });
  }

  // Merken, ob mit Zeiger (Maus/Finger) oder Tastatur geantwortet wird:
  // Nur bei Zeiger wird automatisch weitergeblättert. Mit den Pfeiltasten bleibt man bei der Frage.
  test.addEventListener('pointerdown', () => (perZeiger = true));
  test.addEventListener('keydown', () => (perZeiger = false));

  fragen.forEach((frage, index) => {
    frage.addEventListener('change', (ereignis) => {
      const feld = ereignis.target as HTMLInputElement;
      antworten[frage.dataset.frage ?? ''] = Number(feld.value);
      aktualisiereKnoepfe();
      window.clearTimeout(zeitgeber);
      if (perZeiger && index < fragen.length - 1) {
        zeitgeber = window.setTimeout(() => zeigeFrage(index + 1), AUTOMATISCH_WEITER_MS);
      }
    });
  });

  zurueck.addEventListener('click', () => aktuell > 0 && zeigeFrage(aktuell - 1));
  weiter.addEventListener('click', () => aktuell < fragen.length - 1 && zeigeFrage(aktuell + 1));
  auswerten.addEventListener('click', zeigeErgebnis);
  test.querySelector('[data-neustart]')?.addEventListener('click', () => neuStarten());

  return { neuStarten };
}

/** Richtet alle Selbsttest-Abschnitte auf der Seite ein. */
export function starteSelbsttests() {
  document.querySelectorAll<HTMLElement>('[data-selbsttest]').forEach((wurzel) => {
    const ansage = wurzel.querySelector<HTMLElement>('[data-ansage]');
    const vorlage = wurzel.querySelector<HTMLTemplateElement>('[data-vorlage-fortschritt]')?.innerHTML ?? '{aktuell}/{gesamt}';
    // Ansage für Screenreader; kurz leeren, damit gleiche Texte erneut vorgelesen werden
    const ansagen = (text: string) => {
      if (!ansage) return;
      ansage.textContent = '';
      window.setTimeout(() => (ansage.textContent = text), 50);
    };

    const tests = new Map(
      [...wurzel.querySelectorAll<HTMLElement>('[data-test]')].map((test) => [
        test.dataset.test ?? '',
        { element: test, ...richteFragebogenEin(test, ansagen, vorlage) },
      ]),
    );

    // Auswahl „Für mich selbst“ / „Für mein Kind“: zeigt den passenden Fragebogen und beginnt von vorn
    wurzel.querySelectorAll<HTMLInputElement>('[data-wahl]').forEach((wahl) => {
      wahl.addEventListener('change', () => {
        tests.forEach((test, id) => {
          const gewaehlt = id === wahl.value;
          test.element.hidden = !gewaehlt;
          if (gewaehlt) test.neuStarten({ fokus: false });
        });
      });
    });
  });
}
