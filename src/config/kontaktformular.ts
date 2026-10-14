// Einstellungen für das Kontaktformular: Adresse des Formulardienstes (Forminit) und die Feldnamen,
// die der Dienst erwartet. Benutzt von src/components/KontaktFormular.astro und src/scripts/kontakt.ts.

/**
 * ÄNDERN: Endpunkt des Formulardienstes (aus dem Forminit-Dashboard: https://forminit.com/f/<Formular-ID>).
 * Bleibt er leer, zeigt die Website statt des Formulars den Hinweis mit der E-Mail-Adresse.
 */
export const FORMULAR_ENDPUNKT = 'https://forminit.com/f/vb4ufki959f';

/**
 * Feldnamen, wie Forminit sie erwartet („fi-<Baustein>-<Name>“). Mit falschen Namen kommen
 * die Anfragen leer an. Telefon wird bewusst als Text gesendet: Forminits eigenes Telefonfeld
 * verlangt das internationale Format (+49…) und würde „030 123456“ ablehnen.
 * ÄNDERN: nur, wenn ein anderer Formulardienst genutzt wird.
 */
export const FELDNAMEN = {
  name: 'fi-sender-fullName',
  email: 'fi-sender-email',
  telefon: 'fi-text-telefon',
  anliegen: 'fi-text-anliegen',
  erreichbarkeit: 'fi-text-erreichbarkeit',
  nachricht: 'fi-text-nachricht',
  einwilligung: 'fi-text-einwilligung',
} as const;

/**
 * Unsichtbares Fangfeld gegen Spam-Programme (Honeypot). Menschen sehen es nicht und lassen es leer.
 * ÄNDERN: Wird der Name in den Forminit-Einstellungen geändert, hier denselben Namen eintragen.
 */
export const HONEYPOT_NAME = '_gotcha';

/** Höchstlänge der Nachricht in Zeichen. */
export const NACHRICHT_MAX_ZEICHEN = 1000;

/** Werte des Feldes „Anliegen“ (die Beschriftungen stehen in ui.yaml → kontaktformular.anliegen_optionen). */
export const ANLIEGEN = ['adhs', 'intelligenz', 'klinisch', 'gutachten', 'sonstiges'] as const;

/** Werte des Feldes „Erreichbarkeit“ (Beschriftungen in ui.yaml → kontaktformular.rueckruf_optionen). */
export const ERREICHBARKEIT = ['egal', 'vormittags', 'nachmittags', 'abends'] as const;
