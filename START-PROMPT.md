# Prompts für Claude Code

Kopiere die Texte zwischen den Linien jeweils komplett in Claude Code.

---

## 1. Startprompt (einmalig, zu Beginn)

────────────────────────────────────────

Wir bauen die Website für unsere Praxis „Mentis Uno – psychologische Diagnostik“. In diesem Ordner liegt alles, was du brauchst:

- `CLAUDE.md` – Regeln, die immer gelten
- `SPEZIFIKATION.md` – die vollständige Bauanleitung
- `inhalte/` – alle Texte (Deutsch), die Selbsttests (Deutsch/Englisch) und die globalen Texte
- `logo/` – das fertige Logo als SVG und PNG

Bitte lies zuerst `CLAUDE.md`, `SPEZIFIKATION.md` und alle Dateien in `inhalte/` vollständig. Sieh dir außerdem `logo/logo-vorschau.png` an.

Erstelle dann einen kurzen Plan für **Phase 1** (Abschnitt 12 der Spezifikation) und zeig ihn mir, bevor du etwas installierst oder Dateien anlegst. Wenn dir in Spezifikation oder Inhalten etwas widersprüchlich oder unklar vorkommt, frag mich vorher.

Gestalterisch ist mir wichtig, dass die Seite hochwertig, ruhig und warm wirkt und nicht nach Baukasten aussieht. Nimm dir für Typografie, Abstände und das Bogen-Motiv aus dem Logo Zeit.

Ich bin kein Entwickler. Erkläre mir am Ende jeder Phase in wenigen Sätzen, was entstanden ist und wie ich es mir ansehe.

────────────────────────────────────────

---

## 2. Nach jeder Phase

────────────────────────────────────────

Danke, ich habe es mir angesehen. [Hier Anmerkungen eintragen, z. B. „Der Hero wirkt mir zu leer“ oder „Die Buttons sind zu groß“.]
Bitte setz die Anmerkungen um und mach dann mit Phase [Nummer] weiter. Zeig mir vorher kurz den Plan.

────────────────────────────────────────

---

## 3. Wenn der Formulardienst feststeht (Phase 4 oder später)

────────────────────────────────────────

Wir nutzen für das Kontaktformular [Forminit / nForms / …]. Der Endpunkt lautet: [URL aus dem Dashboard des Dienstes].
Bitte lies die aktuelle Dokumentation dieses Dienstes für reine HTML-Formulare bzw. fetch-Versand. Trag den Endpunkt in `src/config/kontaktformular.ts` ein und passe die Feldnamen an. Bau dabei kein Skript oder SDK des Dienstes ein. Teste anschließend den Versand mit einer Testanfrage und ergänze den Dienst in `inhalte/seiten/de/datenschutz.md` und in der englischen Fassung.

────────────────────────────────────────

---

## 4. Platzhalter füllen

────────────────────────────────────────

Hier sind die fehlenden Angaben:
- Preis ADHS-Diagnostik ab: … €
- Preis Intelligenzdiagnostik ab: … €
- Preis klinische Diagnostik ab: … €
- Dauer jeweils: …
- Berufsbezeichnung Henrik / Lennard: …
- Antwortzeit auf Anfragen: …
- (weitere aus `npm run platzhalter`)

Bitte trag sie in die Inhaltsdateien ein, auch in die englischen Fassungen. Führe danach `npm run platzhalter` aus und zeig mir, was noch offen ist.

────────────────────────────────────────
