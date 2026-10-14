// Bedienung von Kontaktformular und Kontaktdialog im Browser (gehört zu KontaktFormular.astro und KontaktDialog.astro).
// Prüft die Eingaben barrierefrei, sendet per fetch an den Formulardienst und öffnet den Dialog „Termin anfragen“.
// Kein Skript des Formulardienstes, keine Speicherung im Browser.

type Feld = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Ist das Feld in Ordnung? Gibt sonst `false` zurück (die Meldung steht in data-fehler am Feld). */
function istGueltig(feld: Feld): boolean {
  if (feld instanceof HTMLInputElement && feld.type === 'checkbox') return !feld.required || feld.checked;
  if (feld.required && feld.value.trim() === '') return false;
  if (feld instanceof HTMLInputElement && feld.type === 'email' && feld.validity.typeMismatch) return false;
  if (feld instanceof HTMLTextAreaElement && feld.maxLength > 0 && feld.value.length > feld.maxLength) return false;
  return true;
}

/** Zeigt oder entfernt die Fehlermeldung direkt am Feld (verknüpft über aria-describedby). */
function zeigeFehler(feld: Feld, fehlerhaft: boolean) {
  const meldung = feld.form?.querySelector<HTMLElement>(`#${CSS.escape(feld.id)}-fehler`);
  feld.setAttribute('aria-invalid', String(fehlerhaft));
  if (!meldung) return;
  meldung.textContent = fehlerhaft ? (feld.dataset.fehler ?? '') : '';
  meldung.hidden = !fehlerhaft;
}

/** Wählt im Feld „Anliegen“ den passenden Eintrag (z. B. „adhs“). */
export function waehleAnliegen(form: HTMLFormElement, anliegen: string | null | undefined) {
  const auswahl = form.querySelector<HTMLSelectElement>('[data-anliegen-auswahl]');
  if (!auswahl || !anliegen) return;
  const option = [...auswahl.options].find((eintrag) => eintrag.dataset.wert === anliegen);
  if (option) auswahl.value = option.value;
}

function richteFormularEin(form: HTMLFormElement) {
  if (form.dataset.bereit) return;
  form.dataset.bereit = 'ja';
  form.noValidate = true; // eigene, verständliche Meldungen statt der Browser-Blasen

  const felder = [...form.querySelectorAll<Feld>('[data-fehler]')];
  const senden = form.querySelector<HTMLButtonElement>('[data-senden]');
  const erfolg = form.querySelector<HTMLElement>('[data-erfolg]');
  const fehlschlag = form.querySelector<HTMLElement>('[data-fehlschlag]');
  let versucht = false;
  let sendetGerade = false;

  // Nach dem ersten Absendeversuch: Meldungen beim Verlassen bzw. Ändern eines Feldes aktualisieren
  felder.forEach((feld) => {
    const aktualisiere = () => versucht && zeigeFehler(feld, !istGueltig(feld));
    feld.addEventListener('blur', aktualisiere);
    feld.addEventListener('change', aktualisiere);
  });

  form.addEventListener('submit', async (ereignis) => {
    versucht = true;
    const fehlerhaft = felder.filter((feld) => {
      const falsch = !istGueltig(feld);
      zeigeFehler(feld, falsch);
      return falsch;
    });
    if (fehlerhaft.length > 0) {
      ereignis.preventDefault();
      fehlerhaft[0]?.focus();
      return;
    }

    const ziel = form.getAttribute('action');
    if (!ziel || !('fetch' in window)) {
      if (!ziel) ereignis.preventDefault(); // Entwicklung ohne Endpunkt: nichts senden
      return; // sonst normales Absenden ohne JavaScript-Hilfe
    }

    ereignis.preventDefault();
    if (sendetGerade) return;
    sendetGerade = true;
    if (erfolg) erfolg.hidden = true;
    if (fehlschlag) fehlschlag.hidden = true;
    if (senden) {
      senden.textContent = form.dataset.textSendet ?? '';
      senden.setAttribute('aria-disabled', 'true');
    }

    try {
      const antwort = await fetch(ziel, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const daten = (await antwort.json().catch(() => null)) as { success?: boolean; error?: unknown } | null;
      if (!antwort.ok || daten?.success === false || daten?.error) throw new Error('Versand fehlgeschlagen');
      form.reset();
      felder.forEach((feld) => zeigeFehler(feld, false));
      versucht = false;
      if (erfolg) {
        erfolg.hidden = false;
        erfolg.tabIndex = -1;
        erfolg.focus();
      }
    } catch {
      if (fehlschlag) {
        fehlschlag.hidden = false;
        fehlschlag.tabIndex = -1;
        fehlschlag.focus();
      }
    } finally {
      sendetGerade = false;
      if (senden) {
        senden.textContent = form.dataset.textSenden ?? '';
        senden.removeAttribute('aria-disabled');
      }
    }
  });
}

/** Richtet alle Kontaktformulare der Seite ein; Anliegen aus der Adresse (?anliegen=adhs) wird übernommen. */
export function starteKontaktformulare() {
  const ausAdresse = new URLSearchParams(window.location.search).get('anliegen');
  document.querySelectorAll<HTMLFormElement>('form[data-kontaktformular]').forEach((form) => {
    const neu = !form.dataset.bereit;
    richteFormularEin(form);
    if (neu && !form.closest('dialog')) waehleAnliegen(form, ausAdresse);
  });
}

declare global {
  interface Window {
    /** Öffnet den Kontaktdialog, z. B. KontaktDialog.oeffnen({ anliegen: 'adhs' }) */
    KontaktDialog?: { oeffnen: (optionen?: { anliegen?: string }) => void };
  }
}

/**
 * Kontaktdialog: Jeder Link mit data-kontakt-oeffnen öffnet ihn (statt zur Kontaktseite zu wechseln).
 * Fokus springt ins erste Feld, Esc schließt, danach kehrt der Fokus zum auslösenden Button zurück.
 */
export function starteKontaktDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-kontaktdialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const form = dialog.querySelector<HTMLFormElement>('form[data-kontaktformular]');
  let ausloeser: HTMLElement | null = null;

  function oeffnen(optionen: { anliegen?: string } = {}, von?: HTMLElement | null) {
    if (!dialog || dialog.open) return;
    ausloeser = von ?? (document.activeElement as HTMLElement | null);
    if (form) {
      form.querySelectorAll<HTMLElement>('[data-erfolg], [data-fehlschlag]').forEach((meldung) => (meldung.hidden = true));
      if (optionen.anliegen) waehleAnliegen(form, optionen.anliegen);
    }
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    dialog.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, a[href]')?.focus();
  }

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    ausloeser?.focus();
  });

  // Klick neben den Dialog (auf den abgedunkelten Hintergrund) schließt ihn
  dialog.addEventListener('click', (ereignis) => {
    if (ereignis.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-dialog-schliessen]')?.addEventListener('click', () => dialog.close());

  document.addEventListener('click', (ereignis) => {
    const link = (ereignis.target as HTMLElement).closest<HTMLElement>('[data-kontakt-oeffnen]');
    if (!link || dialog.contains(link)) return;
    // Neuer Tab o. Ä. bleibt möglich
    if (ereignis instanceof MouseEvent && (ereignis.metaKey || ereignis.ctrlKey || ereignis.shiftKey || ereignis.button !== 0)) return;
    ereignis.preventDefault();
    oeffnen({ anliegen: link.dataset.anliegen }, link);
  });

  window.KontaktDialog = { oeffnen: (optionen) => oeffnen(optionen) };
}
