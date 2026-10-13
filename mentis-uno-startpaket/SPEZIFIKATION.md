# Spezifikation: Website „Mentis Uno – psychologische Diagnostik“

Diese Datei beschreibt vollständig, was gebaut werden soll. `CLAUDE.md` enthält die dauerhaft geltenden Regeln. Bei Widersprüchen gilt `CLAUDE.md`.

---

## 1. Ziel und Zielgruppen

Mentis Uno ist eine kleine Praxis für psychologische Diagnostik in Berlin. Sie wird von zwei Psychologen betrieben: Henrik Voß und Lennard Telschow. Die Website soll

1. sachlich und warm vermitteln, was angeboten wird (ADHS-, Intelligenz- und klinische Diagnostik, perspektivisch Gutachten),
2. pro Bereich eine kurze, kostenlose **Selbsteinschätzung** anbieten (jeweils für sich selbst und für das eigene Kind),
3. zu einer **Terminanfrage** führen. Das Kontaktformular ist auf jeder Seite schnell erreichbar.
4. deutlich machen, dass sich das Angebot an **Selbstzahler** richtet.

Zielgruppen sind Erwachsene mit eigener Fragestellung, Eltern von Kindern und Jugendlichen sowie Zuweisende (Ärztinnen und Ärzte, Schulen, später Gerichte und Behörden). Viele Besucher kommen über das Smartphone und sind womöglich belastet. Die Seite muss deshalb ruhig, klar und vertrauenswürdig wirken.

---

## 2. Technik

- **Astro** in der aktuellen stabilen Version, Ausgabe als **statische Seite** (`output: 'static'`). Kein Server, keine Datenbank, keine API-Routen.
- **Kein UI-Framework** (kein React/Vue). Astro-Komponenten plus kleine Module in TypeScript (Vanilla) für die Selbsttests, den Kontaktdialog und das Mobilmenü.
- **CSS:** eigenes CSS mit Custom Properties (Design-Tokens, siehe Abschnitt 6), komponentenweise in Astro-`<style>`. Kein Tailwind, damit die Tokens an einer Stelle lesbar bleiben.
- **Schriften:** lokal über npm-Pakete von Fontsource (`@fontsource-variable/fraunces` falls verfügbar, sonst `@fontsource/fraunces`; `@fontsource/source-sans-3`). Nur die Schnitte laden, die genutzt werden. Kein Google-Fonts-CDN.
- **Inhalte:** Astro Content Collections, die direkt aus dem Ordner `inhalte/` laden (Glob- bzw. File-Loader mit `base: './inhalte/...'`). Alle Schemas mit Zod. Ungültige YAML-Dateien müssen den Build mit einer **verständlichen deutschen Fehlermeldung** abbrechen.
- **i18n:** Astro-i18n-Routing, `defaultLocale: 'de'`, `locales: ['de', 'en']`, Deutsch ohne Präfix, Englisch unter `/en/`.
- **Sitemap:** `@astrojs/sitemap` mit `hreflang`-Alternativen. Impressum und Datenschutz bekommen `noindex` und stehen nicht in der Sitemap.
- **Tests:** Vitest für die Auswertungslogik der Selbsttests (siehe 8.4).
- **Node:** aktuelle LTS-Version. `package.json` mit `engines`-Feld.
- **Hosting-Ziel:** statichost.eu (Build-Befehl `npm run build`, Ausgabeordner `dist`). Die Seite muss aber auf jedem statischen Hoster laufen.

### npm-Skripte

| Skript | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver (http://localhost:4321) |
| `npm run build` | Produktions-Build nach `dist/`. Gibt am Ende eine **Warnung** mit allen offenen Platzhaltern aus. |
| `npm run preview` | Build lokal ansehen |
| `npm run test` | Vitest |
| `npm run check` | `astro check` + Tests |
| `npm run platzhalter` | Listet alle `[[PLATZHALTER: …]]` in `inhalte/` und `src/` mit Datei und Zeile (die Doku-Dateien im Hauptordner werden nicht durchsucht) |
| `npm run check:livegang` | Wie `check`, **schlägt fehl**, solange Platzhalter übrig sind oder der Formular-Endpunkt leer ist |

---

## 3. Ordnerstruktur (Ziel)

```
/
├─ CLAUDE.md, SPEZIFIKATION.md, ANLEITUNG.md, PRUEFLISTE-VOR-LIVEGANG.md
├─ README.md                    ← neu: „So ändere ich …“ (siehe 11)
├─ inhalte/                     ← EINZIGE Quelle für Texte (vorhanden)
│  ├─ ui.yaml                   ← globale Texte DE/EN
│  ├─ seiten/de/*.md            ← Seitentexte Deutsch (vorhanden)
│  ├─ seiten/en/*.md            ← Seitentexte Englisch (von dir zu übersetzen)
│  └─ selbsttests/*.yaml        ← 6 Fragebögen DE/EN (vorhanden)
├─ logo/                        ← Logo-Dateien (vorhanden, Quelle)
├─ public/                      ← favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.png, robots.txt
├─ scripts/platzhalter.mjs
└─ src/
   ├─ config/
   │  ├─ site.ts                ← Domain, Sprachen, Seiten-Slugs DE/EN
   │  └─ kontaktformular.ts     ← Endpunkt Formulardienst (ÄNDERN)
   ├─ styles/
   │  ├─ tokens.css             ← Farben, Abstände, Radien, Schriftgrößen (ÄNDERN)
   │  └─ global.css
   ├─ lib/
   │  ├─ auswertung.ts          ← reine Funktion, getestet
   │  ├─ i18n.ts                ← t()-Hilfe für ui.yaml, Slug-Zuordnung
   │  └─ platzhalter.ts         ← Hervorhebung im Dev-Modus
   ├─ components/               ← Header, Footer, SelbstzahlerLeiste, KontaktDialog,
   │                              KontaktFormular, KontaktBlock, Selbsttest, Krisenhinweis,
   │                              Leistungskarte, Ablauf, Person, Logo, Bogen (Deko)
   ├─ layouts/Basis.astro
   └─ pages/ (+ pages/en/)
```

Die vorhandenen Dateien in `inhalte/` werden **nicht** in `src/` kopiert. Sie bleiben die Quelle, damit die Inhaber Texte an genau einer Stelle ändern.

---

## 4. Seiten und URLs

| Seite | Deutsch | Englisch | Quelle |
|---|---|---|---|
| Start | `/` | `/en/` | `startseite.md` |
| ADHS | `/adhs-diagnostik` | `/en/adhd-assessment` | `adhs-diagnostik.md` |
| Intelligenz | `/intelligenzdiagnostik` | `/en/intelligence-assessment` | `intelligenzdiagnostik.md` |
| Klinisch | `/klinische-diagnostik` | `/en/clinical-assessment` | `klinische-diagnostik.md` |
| Über uns | `/ueber-uns` | `/en/about` | `ueber-uns.md` |
| Kontakt | `/kontakt` | `/en/contact` | `kontakt.md` |
| Impressum | `/impressum` | `/en/legal-notice` | `impressum.md` |
| Datenschutz | `/datenschutz` | `/en/privacy` | `datenschutz.md` |

Dazu kommt eine eigene **404-Seite** (zweisprachig, mit Link zur Startseite und Kontaktbutton).

Der Sprachumschalter verlinkt immer auf die **entsprechende** Seite der anderen Sprache. Die Zuordnung steht zentral in `src/config/site.ts`.

### Aufbau der Seiten

**Startseite:** Hero (Überschrift, Unterzeile, Buttons „Termin anfragen“ und „Kostenlose Selbsteinschätzung“, die zu den Selbsttest-Teasern scrollt) → Willkommenstext → drei Leistungskarten → Ablauf in vier Schritten → Selbsttest-Teaser (drei Links direkt zum Test auf der jeweiligen Seite, Anker `#selbsteinschaetzung`) → **Kosten** (Anker `#kosten`: die drei „ab“-Preise, automatisch aus dem Frontmatter der Leistungsseiten gelesen, plus Selbstzahler-Langtext aus `ui.yaml`) → Gutachten-Hinweis → Kontaktblock.

**Leistungsseiten (ADHS, Intelligenz, Klinisch):** Seitenkopf mit Überschrift und Unterzeile → Fließtext aus Markdown → **Selbsteinschätzung** (Anker `#selbsteinschaetzung`) → **Kosten** (Anker `#kosten`: „ab X €“ groß, Dauer, Selbstzahler-Langtext aus `ui.yaml`, Hinweis Kostenvoranschlag) → auf der klinischen Seite der **Krisenhinweis** → Kontaktblock mit vorausgewähltem Anliegen. Eine Seitennavigation („Auf dieser Seite“) ist auf Desktop optional.

**Über uns:** Seitenkopf → zwei Personenkarten nebeneinander (mobil untereinander) mit Initialen-Avatar, Name, Berufsbezeichnung, Zeitleiste der Stationen, Erfahrung, Diagnostik → Text „Wie wir arbeiten“ → Kontaktblock.

**Kontakt:** Seitenkopf → großes Formular links, rechts Kontaktdaten (E-Mail, „Termine nach Vereinbarung“, Berlin) und der Text „So geht es weiter“ → Selbstzahler-Hinweis.

**Impressum / Datenschutz:** schlichtes Textlayout, gut lesbar, mit Stand-Datum. Auf `/en/` ist es eine englische Fassung mit dem Hinweis aus `ui.yaml → hinweis_englisch`.

---

## 5. Überall sichtbarer Kontakt und Selbstzahler-Hinweis

1. **Header (sticky):** Logo links, Navigation, Sprachumschalter und rechts ein deutlicher Button **„Termin anfragen“**. Er öffnet den Kontaktdialog.
2. **Mobil:** Navigation im Menü (Burger). Zusätzlich eine **feste Leiste am unteren Bildschirmrand** mit dem Button „Termin anfragen“. Sie verdeckt keine Inhalte (Padding am Seitenende) und erscheint erst, wenn man am Hero vorbei gescrollt hat.
3. **Kontaktdialog:** natives `<dialog>`. Der Fokus springt ins erste Feld, Esc schließt den Dialog, danach kehrt der Fokus zum auslösenden Button zurück. Ohne JavaScript verlinkt der Button auf `/kontakt`.
4. **Kontaktblock** am Ende **jeder** Seite (außer Kontakt, Impressum, Datenschutz): kurzer Einladungstext und das Formular direkt eingebettet.
5. **Selbstzahler-Hinweis:**
   - schmale, ruhige Infoleiste über dem Header auf allen Seiten (Kurztext aus `ui.yaml`). Sie verlinkt auf einer Leistungsseite auf deren `#kosten`, sonst auf `/#kosten`.
   - Langtext im Kostenabschnitt jeder Leistungsseite,
   - Kurztext im Kontaktformular direkt über dem Absende-Button,
   - Kurztext im Footer.

---

## 6. Gestaltung

### Haltung
Ruhig, warm, vertrauenswürdig, hochwertig, eher wie ein gut gestaltetes Sachbuch als wie eine Klinikbroschüre. Viel Weißraum. Keine Stockfotos, keine Emojis, keine grellen Effekte und keine Floskeln wie „ganzheitlich“ oder „Ihr Wohlbefinden ist unser Anliegen“.

### Farben (Tokens in `src/styles/tokens.css`)

| Token | Wert | Verwendung |
|---|---|---|
| `--sand-50` | `#FBF8F3` | Seitenhintergrund |
| `--sand-100` | `#F5EFE5` | abgesetzte Abschnitte, Karten |
| `--sand-200` | `#EADFCE` | Linien, Rahmen |
| `--sand-300` | `#D9C9B0` | Deko |
| `--ink` | `#2F2A25` | Fließtext, Überschriften (13,4:1 auf sand-50) |
| `--ink-soft` | `#5E554C` | Nebentexte (6,9:1 auf sand-50) |
| `--sage-100` | `#E3EAE1` | ruhige Flächen, z. B. Selbsttest-Box |
| `--sage-500` | `#6F8A73` | **nur Deko** (Logo, Bögen); 3,6:1, nicht für Text |
| `--sage-700` | `#4F6A55` | Links, Fokus-Ring, Akzenttexte (5,6:1) |
| `--terra-100` | `#F4E1D8` | Hinweisflächen |
| `--terra-500` | `#B8644A` | **nur Deko/Logo** oder Schrift ≥ 24 px |
| `--terra-600` | `#9E4F37` | Primär-Buttons mit Text in `--sand-50` (5,5:1) |
| Footer | `--ink` als Hintergrund, Text `--sand-100` (12,4:1), Nebentext `#CFC4B6` (8,3:1) | |

Ein Dark Mode ist nicht nötig (der Footer ist dunkel). Die Tokens sollen aber so benannt sein, dass er später ergänzt werden kann.

### Typografie
- Überschriften: **Fraunces** (400–500, die kursive 400 sparsam für Akzentwörter, analog zu „*uno*“ im Logo).
- Fließtext und UI: **Source Sans 3** (400, 600).
- Grundgröße 18 px (1.125rem), Zeilenhöhe 1.6, Textspalten max. ca. 68 Zeichen.
- Fluide Schriftskala mit `clamp()`, H1 auf Desktop etwa 56–64 px, mobil etwa 36–40 px.

### Formen und Motive
- Das wiederkehrende Motiv sind die **Bögen aus der Bildmarke** (zwei Kreisbögen um einen Punkt). Einsatz:
  - im Hero als große, ruhige SVG-Komposition aus dünnen Bögen in `--sage-500` und `--terra-500` mit geringer Deckkraft und einer sanften Zeichen-Animation beim Laden (nur ohne `prefers-reduced-motion`),
  - als kleine Nummernkreise bei den Ablaufschritten,
  - als Initialen-Avatare auf „Über uns“ (Initialen in Fraunces, umgeben von den zwei Bögen),
  - als kurzer Terrakotta-Bogen als Abschnittstrenner (sparsam).
- Karten: Radius 20 px, Hintergrund `--sand-100`, feiner Rahmen `--sand-200`, kaum Schatten. Hover: sanftes Anheben (2 px) und ein Rahmen in `--sage-500`.
- Buttons: Pillenform. Primär `--terra-600` mit Text `--sand-50`. Sekundär mit Rahmen in `--ink`.
- Abschnitte wechseln zwischen `--sand-50` und `--sand-100`. Die Selbsttests stehen auf `--sage-100`.
- Raster: max. Inhaltsbreite 1180 px, seitlicher Rand mobil 20 px.
- Icons: wenige, schlichte Linien-Icons als Inline-SVG, aus einem npm-Paket lokal gebündelt (z. B. Lucide), kein Icon-CDN.

### Logo und Icons
Aus `logo/` übernehmen:
- Header: `logo-mentis-uno-de.svg` bzw. `-en.svg` (inline oder als `<img>` mit Alt-Text). Mobil darf die Unterzeile entfallen: Dann Bildmarke plus Wortmarke, eine eigene Variante als Komponente.
- Footer: `-negativ`-Varianten.
- `favicon.svg`, `favicon-32.png` und `apple-touch-icon-180.png` nach `public/`.
- `og-image.png` (1200 × 630) per Skript aus dem Logo erzeugen: Sand-Hintergrund, Logo mittig, Leitsatz darunter.

---

## 7. Inhalte aus `inhalte/`

- **`ui.yaml`:** Alle kurzen Texte für beide Sprachen. Zugriff über eine kleine `t('pfad.zum.text', lang)`-Funktion. Platzhalter in geschweiften Klammern (`{jahr}`, `{aktuell}`, `{datenschutz_link}`) werden ersetzt.
- **`seiten/de/*.md`:** Das Frontmatter enthält strukturierte Teile (Hero, Karten, Ablauf, Personen, Preis …), der Body den Fließtext. Für jedes Frontmatter ein Zod-Schema anlegen. HTML-Kommentare im Markdown sind Hinweise für die Inhaber und dürfen nicht im HTML erscheinen.
- **`seiten/en/*.md`:** Du legst sie als **sorgfältige englische Übersetzung** der deutschen Dateien an, mit identischem Frontmatter-Aufbau. Kopfkommentar: „Übersetzung aus dem Deutschen – bitte prüfen.“ Zeilenumbrüche in Adressen werden beibehalten. Deutsche Rechtsbegriffe (DDG, DSGVO/GDPR, GOP) erklären, nicht wegübersetzen.
- **`selbsttests/*.yaml`:** siehe 8.
- **Platzhalter `[[PLATZHALTER: …]]`:** Im Dev-Modus gelb markiert sichtbar rendern. Im Build bleiben sie als Text stehen, `npm run build` warnt. `preis_ab` darf als Platzhalter vorliegen: Dann zeigt der Kostenabschnitt den markierten Platzhalter statt einer Zahl.

---

## 8. Selbsteinschätzungen

### 8.1 Einbindung
Auf jeder Leistungsseite gibt es einen Abschnitt `#selbsteinschaetzung` mit Überschrift und dem Hinweis vorab (`ui.yaml → selbsttest.hinweis_vorab`). Zuerst wählt man per Segmentauswahl „Für mich selbst“ oder „Für mein Kind“. Welche zwei Tests zu einer Seite gehören, steht im Frontmatter (`selbsttests: [adhs-selbst, adhs-fremd]`). Zu jedem Test werden Zielgruppe, Einleitung und Zeitraum angezeigt.

### 8.2 Ablauf
- **Eine Frage pro Schritt** mit Fortschrittsanzeige („Frage 3 von 8“, plus schmaler Balken).
- Antworten als große, gut tippbare Optionen. Technisch ist das eine `fieldset` mit Radio-Buttons, die als Karten gestaltet sind. Die Auswahl einer Antwort geht nach kurzer Verzögerung (ca. 250 ms) automatisch weiter. Ein „Zurück“-Button ist immer vorhanden.
- Pro Frage gilt die Skala aus `standardskala` oder aus der eigenen `skala` der Frage.
- Nach der letzten Frage erscheint das Ergebnis: Titel und Text der Stufe, der Hinweis `hinweis_ergebnis`, **kein Punktwert und keine Prozentzahl**. Dazu ein dezentes Stufen-Symbol (drei Bögen, 1–3 gefüllt, in Sage-Tönen, nicht rot oder grün).
- Unter dem Ergebnis: `cta_text` und der Button „Termin anfragen“. Er öffnet den Kontaktdialog mit vorausgewähltem Anliegen (`bereich` des Tests). Außerdem gibt es einen Button „Neu starten“.
- Bei `krisenhinweis: true` wird unter **jedem** Ergebnis der Krisenhinweis aus `ui.yaml` angezeigt.
- **Keine Speicherung:** kein localStorage, keine Cookies, keine Übertragung, keine Analytics-Events. Der Zustand lebt nur in Variablen.

### 8.3 Auswertung (`src/lib/auswertung.ts`, reine Funktion)
```
summe = Summe aller gewählten Werte
stufe = erste Stufe (in Dateireihenfolge) mit summe <= max_summe
für jede Regel in auswertung.hochstufen:
    wenn mindestens eine der Fragen in regel.fragen einen Wert >= regel.ab_wert hat:
        stufe = die höhere von (stufe, regel.mindeststufe), gemessen an der Reihenfolge der Stufen
```
Sind nicht alle Fragen beantwortet, kann kein Ergebnis angezeigt werden: Der Button bleibt deaktiviert.

### 8.4 Validierung und Tests
- Zod-Schema für die Test-YAMLs. Zusätzliche Prüfungen beim Build:
  - Jede `skala`-Referenz existiert.
  - Die IDs der Fragen sind eindeutig.
  - Alle IDs in `hochstufen` existieren.
  - Die `max_summe` der Stufen steigt strikt.
  - Die letzte `max_summe` ist gleich der maximal erreichbaren Summe.
  - Jeder Text hat `de` und `en`.
- Vitest: für **jede** der 6 Dateien „alles 0 → erste Stufe“ und „alles Maximum → letzte Stufe“. Dazu Grenzwerttests (genau `max_summe` bzw. +1) und je ein Test pro `hochstufen`-Regel.

### 8.5 Barrierefreiheit
Frage als `legend` mit sichtbarem Fokus. Nach jedem Schritt springt der Fokus auf die neue Frage, und eine Live-Region meldet den Fortschritt. Das Ergebnis wird angesagt. Alles ist per Tastatur bedienbar.

---

## 9. Kontaktformular

### 9.1 Felder (Texte aus `ui.yaml → kontaktformular`)
| Feld | Typ | Pflicht |
|---|---|---|
| Name | text, `autocomplete="name"` | ja |
| E-Mail | email | ja |
| Telefon | tel | nein |
| Anliegen | select (adhs, intelligenz, klinisch, gutachten, sonstiges) | ja |
| Erreichbarkeit | select (egal, vormittags, nachmittags, abends) | nein |
| Nachricht | textarea, max. 1000 Zeichen, mit Hinweis „keine ausführlichen Gesundheitsangaben“ | nein |
| Einwilligung | checkbox mit Link zur Datenschutzerklärung | ja |
| Honeypot | verstecktes Feld, nicht fokussierbar, `aria-hidden` | – |

Über dem Absende-Button steht der Selbstzahler-Kurztext. Die Validierung läuft clientseitig und barrierefrei: Fehlermeldungen stehen am Feld, sind über `aria-describedby` verknüpft und benennen den Fehler konkret.

### 9.2 Versand
- Konfiguration nur in `src/config/kontaktformular.ts`: `endpoint` (Formulardienst-URL, anfangs leer) und eine Feldnamen-Zuordnung, falls der Dienst bestimmte Namen verlangt.
- Versand per `fetch` (POST, `FormData`, `Accept: application/json`). Ohne JavaScript funktioniert das normale Formular-POST an den Endpunkt (progressive Enhancement).
- **Kein** SDK und **kein** Skript des Formulardienstes einbinden. Keine UTM- oder Tracking-Felder, kein reCAPTCHA.
- Erfolgs- und Fehlermeldung inline (Texte aus `ui.yaml`). Bei Erfolg wird das Formular geleert.
- Ist `endpoint` leer: Im Dev-Modus erscheint ein gut sichtbarer Hinweis „Formular-Endpunkt noch nicht eingetragen“. Im Build wird statt des Formulars der Hinweis mit `mailto:anfragen@mentis.uno` angezeigt.
- Sobald die Inhaber den Formulardienst festgelegt haben, liest du dessen **aktuelle Dokumentation** und passt Feldnamen und Antwortverarbeitung an. Empfohlen werden EU-Dienste mit Auftragsverarbeitungsvertrag, z. B. Forminit (Speicherung bei AWS in Irland) oder nForms (Frankfurt, Beta).

### 9.3 Vorbelegung
Das Anliegen kann vorbelegt werden durch
- den Aufruf `KontaktDialog.oeffnen({ anliegen: 'adhs' })` (Selbsttest-Ergebnis, Leistungsseite, Gutachten-Button) oder
- den URL-Parameter `/kontakt?anliegen=adhs` (Fallback ohne JavaScript).

Der Kontaktblock einer Leistungsseite belegt das passende Anliegen automatisch vor.

---

## 10. Qualität

- **Barrierefreiheit:** Ziel WCAG 2.2 AA. Dazu gehören semantisches HTML, ein Skip-Link, sichtbare Fokus-Ringe (`--sage-700`, 3 px), Kontraste wie in der Farbtabelle, Touch-Ziele von mindestens 44 px, `lang`-Attribute und Alt-Texte. `prefers-reduced-motion` wird respektiert.
- **Performance:** Ziel Lighthouse ≥ 95 in allen Kategorien. JavaScript nur dort, wo es gebraucht wird (Inseln bzw. Module). Schriften vorladen, `font-display: swap`. SVG statt Rastergrafiken.
- **SEO:** individuelle `<title>` und `meta description` aus dem Frontmatter, Open-Graph-Tags mit `og-image.png`, kanonische URLs, `hreflang`, `robots.txt`, Sitemap.
- **Datenschutz:** keine externen Requests beim Seitenaufruf. Das prüfst du nach dem Build, indem du in `dist/` nach `http://` und `https://` suchst. Erlaubt sind nur eigene Links, `mailto:` und der Formular-Endpunkt.
- **Responsiv:** sauber ab 320 px Breite, kein horizontales Scrollen.

---

## 11. Kommentare und README für die Inhaber

Die Inhaber sind keine Entwickler. Deshalb:
- Jede Komponente und jedes Modul beginnt mit einem kurzen **deutschen** Kommentar: Was macht die Datei? Wo wird sie verwendet?
- Stellen, die man typischerweise ändert, bekommen den Kommentar `ÄNDERN:` mit einer Erklärung, zum Beispiel Farben, Formular-Endpunkt, Preise oder Menüreihenfolge.
- **README.md** auf Deutsch, Abschnitt „So ändere ich …“ mit konkreten Beispielen:
  - einen Text, einen Preis, eine Testfrage, einen Schwellenwert,
  - eine Farbe, das Logo,
  - den Formular-Endpunkt,
  - wie ich die Seite lokal starte und veröffentliche,
  - was `npm run check:livegang` prüft.

---

## 12. Vorgehen in Phasen

Arbeite in diesen Phasen. Halte nach jeder Phase an, fasse kurz zusammen, was entstanden ist und wie man es ansieht, und mache einen Git-Commit.

1. **Grundgerüst:** Astro-Projekt, Content Collections mit Schemas und Validierung, Tokens, Schriften, Basis-Layout, Header, Footer, Selbstzahler-Leiste, Mobilmenü, Logo, Favicons. Dazu eine Startseite mit echten Inhalten.
2. **Alle deutschen Seiten** mit Inhalten aus `inhalte/seiten/de`.
3. **Selbsteinschätzungen** inklusive Auswertung, Validierung und Vitest.
4. **Kontakt:** Dialog, Formular, Kontaktblock, Vorbelegung, Endpunkt-Konfiguration.
5. **Englisch:** Übersetzungen anlegen, Routing, Sprachumschalter, hreflang.
6. **Feinschliff:** 404-Seite, SEO, og-image, Platzhalter-Skripte, README, Prüfungen aus Abschnitt 10, Prüfung der externen Requests.
7. **Veröffentlichung vorbereiten:** Git-Repository sauber, `.gitignore`, kurze Anleitung für statichost.eu im README.
