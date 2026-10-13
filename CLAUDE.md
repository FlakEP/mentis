# CLAUDE.md – Website Mentis Uno

Statische, zweisprachige Website (DE/EN) für **Mentis Uno – psychologische Diagnostik**, Berlin. Domain: `mentis.uno`. Inhaber: Henrik Voß und Lennard Telschow. Sie sind keine Entwickler: Erkläre Schritte kurz und verständlich auf Deutsch.

Die vollständige Bauanleitung steht in **`SPEZIFIKATION.md`**. Lies sie zu Beginn einer neuen Sitzung, bevor du an einer Phase weiterarbeitest. Diese Datei hier enthält nur die Regeln, die immer gelten.

## Stack
Astro (statisch), TypeScript, eigenes CSS mit Design-Tokens, Content Collections aus `inhalte/`, Vitest. Kein UI-Framework, kein Tailwind, kein Server.

## Befehle
- `npm run dev` – lokal ansehen (http://localhost:4321)
- `npm run build` – Produktions-Build nach `dist/`
- `npm run check` – Typprüfung + Tests
- `npm run platzhalter` – offene `[[PLATZHALTER: …]]` auflisten
- `npm run check:livegang` – schlägt fehl, solange Platzhalter offen sind oder der Formular-Endpunkt fehlt

## Inhalte
- **Alle Texte kommen aus `inhalte/`** (`ui.yaml`, `seiten/de|en/*.md`, `selbsttests/*.yaml`). Schreibe keine Inhaltstexte fest in Komponenten.
- Formulierungen in `inhalte/` änderst du nur, wenn die Inhaber darum bitten. Ausnahmen sind offensichtliche Tippfehler, die du benennst. Inhaltliche Verbesserungsvorschläge machst du im Chat, nicht in der Datei.
- Platzhalter `[[PLATZHALTER: …]]` bleiben stehen, bis die Inhaber echte Werte liefern. Erfinde niemals Preise, Zahlen, Telefonnummern, Qualifikationen, Bewertungen oder Testimonials.

## Rechtliche und fachliche Leitplanken (nicht verhandelbar)
- **Kein Tracking:** keine Cookies, kein Analytics, keine externen Schriften, Skripte, Karten oder Videos. Alles wird lokal ausgeliefert. Einzige Ausnahme ist der Formular-Endpunkt.
- **Selbsttests speichern nichts:** kein localStorage, keine Übertragung, keine Events. Ergebnisse ohne Punktwert, ohne Diagnose-Sprache, immer mit dem Hinweis „nicht validiert, keine Diagnose“.
- **Kein Doktortitel** vor den Namen (die Promotionen laufen noch). Verwende „Psychotherapeut“ und andere geschützte Bezeichnungen nur, wenn sie in `inhalte/` stehen.
- **Werberecht (HWG, Berufsordnung):** sachlich bleiben. Keine Heilsversprechen, keine Angstappelle, keine Superlative („beste“, „garantiert“), keine Erfolgsquoten.
- **Selbstzahler-Hinweis** und Kontaktmöglichkeit sind auf jeder Seite sichtbar (siehe Spezifikation, Abschnitt 5).
- Der **Krisenhinweis** erscheint auf der Seite zur klinischen Diagnostik und unter jedem Ergebnis eines klinischen Tests.

## Code-Konventionen
- Kommentare auf **Deutsch**. Jede Datei beginnt mit 1–3 Zeilen: Was macht sie, wo wird sie benutzt?
- Typische Änderungsstellen markierst du mit `ÄNDERN:` und einer Erklärung.
- Design-Werte nur über die Tokens in `src/styles/tokens.css`, keine Farbwerte direkt in Komponenten.
- Barrierefreiheit nach WCAG 2.2 AA ist Teil jeder Aufgabe, nicht ein Extra.
- Kleine, gut benannte Komponenten. Lieber gut lesbar als besonders clever.

## Arbeitsweise
- Arbeite in den Phasen aus `SPEZIFIKATION.md` (Abschnitt 12). Plane eine Phase, setze sie um und prüfe sie (`npm run build` und `npm run check` müssen fehlerfrei laufen). Danach kurz zusammenfassen und committen.
- Vor jeder Zusammenfassung prüfst du, ob in `dist/` externe URLs auftauchen. Erlaubt sind nur eigene Links, `mailto:` und der Formular-Endpunkt.
- Wenn eine Entscheidung den Inhabern zusteht (Formulardienst, Texte, rechtliche Angaben), frag nach, statt zu raten.
- Commit-Nachrichten auf Deutsch, kurz und beschreibend.
