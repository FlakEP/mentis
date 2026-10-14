// Tests für die Textverarbeitung (Platzhalter, Akzentwörter, Variablen) und die t()-Funktion.
import { describe, expect, it } from 'vitest';
import { erstelleUebersetzer, textAusBaum } from './i18n';
import { enthaeltPlatzhalter, ersetzeVariablen, findeTelefonnummern, ohneBetonung, zerlegeText } from './text';

describe('zerlegeText', () => {
  it('erkennt Platzhalter mitten im Text', () => {
    expect(zerlegeText('innerhalb von [[PLATZHALTER: z. B. zwei Werktagen]].')).toEqual([
      { art: 'text', text: 'innerhalb von ' },
      { art: 'platzhalter', text: '[[PLATZHALTER: z. B. zwei Werktagen]]' },
      { art: 'text', text: '.' },
    ]);
  });

  it('erkennt *betonte* Wörter nur, wenn gewünscht', () => {
    const text = 'Klarheit beginnt mit einer *sorgfältigen* Diagnostik.';
    expect(zerlegeText(text)).toEqual([{ art: 'text', text }]);
    expect(zerlegeText(text, { betonung: true })).toEqual([
      { art: 'text', text: 'Klarheit beginnt mit einer ' },
      { art: 'betont', text: 'sorgfältigen' },
      { art: 'text', text: ' Diagnostik.' },
    ]);
  });

  it('entfernt Sternchen für den Seitentitel', () => {
    expect(ohneBetonung('einer *sorgfältigen* Diagnostik')).toBe('einer sorgfältigen Diagnostik');
  });

  it('erkennt offene Platzhalter', () => {
    expect(enthaeltPlatzhalter('[[PLATZHALTER: Preis]]')).toBe(true);
    expect(enthaeltPlatzhalter('450')).toBe(false);
  });
});

describe('ui-Texte', () => {
  const baum = {
    marke: { name: 'Mentis Uno' },
    footer: { copyright: { de: '© {jahr} Mentis Uno', en: '© {jahr} Mentis Uno' } },
    buttons: { weiter: { de: 'Weiter', en: 'Next' } },
  };

  it('liefert die passende Sprache', () => {
    expect(textAusBaum(baum, 'buttons.weiter', 'de')).toBe('Weiter');
    expect(textAusBaum(baum, 'buttons.weiter', 'en')).toBe('Next');
    expect(textAusBaum(baum, 'marke.name', 'en')).toBe('Mentis Uno');
  });

  it('ersetzt Variablen wie {jahr}', () => {
    expect(erstelleUebersetzer(baum, 'de')('footer.copyright', { jahr: 2026 })).toBe('© 2026 Mentis Uno');
    expect(ersetzeVariablen('Frage {aktuell} von {gesamt}', { aktuell: 3 })).toBe('Frage 3 von {gesamt}');
  });

  it('meldet fehlende Texte verständlich', () => {
    expect(() => textAusBaum(baum, 'buttons.gibtsnicht', 'de')).toThrow('fehlt in inhalte/ui.yaml');
  });
});

describe('findeTelefonnummern', () => {
  it('erkennt alle Nummern aus dem Krisenhinweis', () => {
    const text =
      'Notruf 112 oder TelefonSeelsorge: 0800 111 0 111, 0800 111 0 222 oder 116 123. Nummer gegen Kummer 116 111, Elterntelefon 0800 111 0 550.';
    const nummern = findeTelefonnummern(text)
      .filter((teil) => teil.art === 'telefon')
      .map((teil) => (teil.art === 'telefon' ? teil.nummer : ''));
    expect(nummern).toEqual(['112', '08001110111', '08001110222', '116123', '116111', '08001110550']);
  });

  it('lässt den übrigen Text unverändert', () => {
    const text = 'Rund um die Uhr: 116 123.';
    expect(findeTelefonnummern(text).map((teil) => teil.text).join('')).toBe(text);
  });
});
