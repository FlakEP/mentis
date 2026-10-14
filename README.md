# Website Mentis Uno – psychologische Diagnostik

Statische, zweisprachige Website (Deutsch/Englisch) für **mentis.uno**. Gebaut mit Astro, ohne Server, ohne Cookies, ohne Tracking.

- **Texte, Preise, Fragebögen:** alles im Ordner `inhalte/`
- **Farben, Schriftgrößen, Abstände:** `src/styles/tokens.css`
- **Adressen der Seiten und Menü:** `src/config/site.ts`
- **Kontaktformular (Forminit):** `src/config/kontaktformular.ts`

Weitere Dokumente: `ANLEITUNG.md` (Einrichtung), `PRUEFLISTE-VOR-LIVEGANG.md` (fachliche und rechtliche Punkte), `SPEZIFIKATION.md` (Bauanleitung), `CLAUDE.md` (Regeln für Claude Code).

---

## Die Website lokal ansehen

Voraussetzung: [Node.js](https://nodejs.org) in der aktuellen LTS-Version. Im Projektordner einmalig:

```
npm install
```

Danach:

```
npm run dev
```

und im Browser **http://localhost:4321** öffnen. Änderungen an Texten erscheinen nach dem Speichern sofort. Offene Platzhalter sind in dieser Ansicht **gelb markiert**. Beenden mit `Strg + C` im Terminal.

### Alle Befehle

| Befehl | Was er tut |
|---|---|
| `npm run dev` | Website lokal ansehen (http://localhost:4321) |
| `npm run build` | fertige Website in den Ordner `dist/` bauen; warnt am Ende, wenn noch Platzhalter offen sind |
| `npm run preview` | die gebaute Website aus `dist/` lokal ansehen |
| `npm run check` | Typprüfung und automatische Tests |
| `npm run test` | nur die automatischen Tests (Auswertung der Fragebögen u. a.) |
| `npm run platzhalter` | listet alle offenen `[[PLATZHALTER: …]]` mit Datei und Zeile |
| `npm run check:livegang` | wie `check`, schlägt aber zusätzlich fehl, solange Platzhalter offen sind oder der Formular-Endpunkt fehlt |
| `npm run og-bild` | erzeugt die Vorschaubilder für geteilte Links neu (nur nach Änderungen an Logo oder Leitsatz) |

**Fehler in einer Inhaltsdatei?** Dann bricht `npm run build` mit einer deutschen Meldung ab, z. B.:

```
inhalte/seiten/de/startseite.md
   • leistungen: Unbekanntes Feld „ueberschirft“ – Tippfehler oder falsche Einrückung?
```

Die genannte Stelle korrigieren und den Befehl erneut starten.

---

## So ändere ich …

### … einen Text

Alle Texte stehen in `inhalte/`:

| Was | Wo |
|---|---|
| Seitentexte (Deutsch) | `inhalte/seiten/de/<seite>.md` |
| Seitentexte (Englisch) | `inhalte/seiten/en/<seite>.md` |
| Kurze Texte auf mehreren Seiten (Menü, Buttons, Formular, Footer, Krisenhinweis) | `inhalte/ui.yaml` |
| Fragebögen | `inhalte/selbsttests/*.yaml` |

Eine Seitendatei hat oben einen **Kopfbereich** zwischen zwei Zeilen `---` (Überschriften, Karten, Preis …) und darunter den **Fließtext**. Beispiel aus `inhalte/seiten/de/startseite.md`:

```yaml
hero:
  ueberschrift: "*Klarheit* beginnt mit einer sorgfältigen Diagnostik."
```

Ein Wort in `*Sternchen*` wird in Überschriften kursiv und in Terrakotta gesetzt (wie „uno“ im Logo).

Im Fließtext gilt Markdown: `## Zwischenüberschrift`, `- Aufzählung`, `1. Nummerierung`, `**fett**`. Zeilen, die zwischen `<!--` und `-->` stehen, sind Notizen und erscheinen nicht auf der Website.

**Wichtig beim Bearbeiten:** Einrückungen (Leerzeichen am Zeilenanfang) müssen erhalten bleiben. Texte mit Doppelpunkt in `"Anführungszeichen"` setzen. Wer einen deutschen Text ändert, ändert bitte auch die englische Fassung.

### … einen Preis oder die Dauer

Im Kopfbereich der jeweiligen Leistungsseite, z. B. `inhalte/seiten/de/adhs-diagnostik.md`:

```yaml
preis_ab: "450"   # nur die Zahl in Euro
dauer: "zwei bis drei Termine"
```

Der Preis erscheint automatisch auf der Leistungsseite **und** im Kostenabschnitt der Startseite. Gleiches in `inhalte/seiten/en/adhs-diagnostik.md` eintragen (dort `dauer` auf Englisch).

### … eine Testfrage

In der Datei des Fragebogens, z. B. `inhalte/selbsttests/adhs-selbst.yaml`:

```yaml
fragen:
  - id: a1
    de: "Bei Aufgaben, die mich wenig interessieren, verliere ich schnell die Konzentration."
    en: "When a task doesn't interest me much, I quickly lose focus."
```

- Jede Frage braucht eine **eigene ID** (a1, a2 …) und einen Text auf Deutsch **und** Englisch.
- Eine Frage mit anderer Antwortskala bekommt die Zeile `skala: zustimmung` (die Skalen stehen unten in der Datei).
- Wer eine Frage hinzufügt oder entfernt, muss die **Schwellenwerte anpassen** (nächster Abschnitt) – die letzte Stufe muss genau die höchste erreichbare Summe haben. Der Build meldet es, wenn das nicht stimmt.

### … einen Schwellenwert

Ebenfalls in der Datei des Fragebogens unter `auswertung`:

```yaml
auswertung:
  stufen:
    - id: gering
      max_summe: 7      # 0–7 Punkte
    - id: mittel
      max_summe: 14     # 8–14 Punkte
    - id: deutlich
      max_summe: 24     # 15–24 Punkte (= höchste erreichbare Summe)
  hochstufen:
    - { fragen: [a8], ab_wert: 3, mindeststufe: mittel }
```

- `max_summe` muss von Stufe zu Stufe **steigen**.
- `hochstufen` (optional): Hat eine der genannten Fragen mindestens den Wert `ab_wert`, gilt mindestens die genannte Stufe.
- Danach `npm run test` ausführen: Die Tests rechnen alle Grenzwerte automatisch nach.

### … eine Farbe

In `src/styles/tokens.css`, Abschnitt „1. Grundfarben“:

```css
--terra-600: #9e4f37; /* Primär-Buttons (Text --sand-50, 5,5:1) */
```

Den Farbwert ändern – er gilt dann überall. **Achtung:** Text braucht mindestens 4,5:1 Kontrast zum Hintergrund (prüfbar z. B. mit dem „WebAIM Contrast Checker“). Farben, die mit „nur Deko“ markiert sind, nicht für Text verwenden.

### … das Logo

Die Logo-Dateien liegen in `logo/`. Die Website baut das Logo aus `logo/logo-mentis-uno-de.svg` bzw. `-en.svg` zusammen und färbt es über die Farb-Tokens ein. Ein neues Logo muss denselben Aufbau haben (zwei Bögen, Punkt, Wortmarke „mentis“, Wortmarke „uno“, Unterzeile) – am einfachsten Claude Code bitten. Favicons: `favicon.svg`, `favicon-32.png` und `apple-touch-icon.png` in `public/` ersetzen. Danach `npm run og-bild` für die Vorschaubilder.

### … den Formular-Endpunkt

In `src/config/kontaktformular.ts`:

```ts
export const FORMULAR_ENDPUNKT = 'https://forminit.com/f/vb4ufki959f';
```

- Leer lassen (`''`) zeigt statt des Formulars den Hinweis mit der E-Mail-Adresse.
- Die Feldnamen (`fi-sender-email` usw.) sind auf Forminit abgestimmt und nur bei einem anderen Dienst zu ändern.
- Im Forminit-Dashboard: Authentifizierung „Public“, Benachrichtigung an `anfragen@mentis.uno`, erlaubte Domain `mentis.uno`, Spamschutz nur per Honeypot (Feldname `_gotcha`), Speicherdauer so kurz wie möglich.

### … eine Seitenadresse oder das Menü

In `src/config/site.ts`: `SEITEN` enthält die Adressen in beiden Sprachen, `HAUPTNAVIGATION` die Reihenfolge im Menü. Die Sprachverweise für Suchmaschinen und der Sprachumschalter passen sich automatisch an.

---

## Was `npm run check:livegang` prüft

1. **Typprüfung** des Codes (`astro check`)
2. **Automatische Tests**: alle sechs Fragebögen (Grenzwerte, Hochstufungen, Aufbau) und Hilfsfunktionen
3. **Offene Platzhalter** in `inhalte/` und `src/` (auskommentierte Zeilen zählen nicht)
4. **Formular-Endpunkt** in `src/config/kontaktformular.ts` ist eingetragen

Erst wenn alles grün ist **und** `PRUEFLISTE-VOR-LIVEGANG.md` abgehakt ist, die Domain umstellen.

---

## Veröffentlichen

Die Website ist für **statichost.eu** vorbereitet (Build-Befehl `npm run build`, Ausgabeordner `dist`), läuft aber auf jedem Hoster für statische Seiten. Die Schritt-für-Schritt-Anleitung steht in `ANLEITUNG.md`, Schritt 6. Jede Änderung, die ins Repository hochgeladen wird, veröffentlicht die Website danach automatisch neu.

---

## Datenschutz im Code

- Keine Cookies, kein Analytics, keine Schriften oder Skripte von fremden Servern. Einzige Ausnahme: das Absenden des Kontaktformulars an Forminit.
- Die Selbsteinschätzungen werten nur im Browser aus und speichern nichts (kein localStorage, keine Übertragung).
- Nach jedem Build lässt sich prüfen, ob fremde Adressen auftauchen: in `dist/` nach `http://` und `https://` suchen – erlaubt sind nur `mentis.uno`, `mailto:` und der Forminit-Endpunkt.
