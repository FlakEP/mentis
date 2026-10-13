# Prüfliste vor dem Livegang

Diese Punkte kann Claude Code nicht für euch entscheiden. Bitte vor der Veröffentlichung abhaken. Hinweis: Das ist keine Rechtsberatung. Bei den rechtlichen Punkten lohnt sich eine kurze Abklärung mit der Psychotherapeutenkammer Berlin oder einer Anwältin bzw. einem Anwalt für Medizinrecht.

## A. Grundsätzliches (vor allem anderen klären)

- [ ] **Dürfen wir das so anbieten?** Die Diagnostik psychischer Störungen (ADHS-Diagnostik, klinische Diagnostik) gilt in Deutschland in der Regel als **Ausübung der Heilkunde**. Selbstständig ist das nur mit **Approbation** oder einer **Heilpraktikererlaubnis** (beschränkt auf Psychotherapie) erlaubt. Für Intelligenzdiagnostik ohne Krankheitsbezug und für Gutachten im Auftrag von Gerichten oder Behörden gilt das meist nicht. Falls ihr zum Start noch in der Ausbildung und nicht approbiert seid, klärt vorab, welche Leistungen ihr wie anbieten dürft. Möglicherweise startet ihr zunächst mit einem Teil des Angebots oder mit HP-Erlaubnis.
- [ ] **Berufsbezeichnung:** „Psychotherapeut“ (auch „Psychologischer Psychotherapeut“) ist gesetzlich geschützt und erst mit Approbation erlaubt. Bis dahin z. B. „Psychologe (M.Sc.)“. Die Bezeichnung steht in `inhalte/seiten/de/ueber-uns.md` und im Impressum.
- [ ] **Doktortitel:** Erst nach Abschluss der Promotion führen. Bis dahin steht nur „Promotion an der Charité, seit 2023“ in der Vita (so ist es bereits angelegt).
- [ ] **GOP-Hinweis:** Die Gebührenordnung für Psychotherapeuten gilt unmittelbar für approbierte Psychotherapeuten. Ohne Approbation ändert den Text in `ui.yaml → selbstzahler.lang`, z. B. in „in Anlehnung an die GOP“ oder in eine eigene Honorarvereinbarung.

## B. Impressum und Datenschutz

- [ ] Impressum: Platzhalter füllen (Berufsbezeichnung, ggf. Kammer und USt-IdNr.). Nach Gründung der GbR die Angaben auf die GbR umstellen.
- [ ] Euch ist bewusst: Die **Privatanschrift** steht öffentlich im Impressum. Sie muss dort eine ladungsfähige Anschrift sein. Eine reine Postfach- oder Briefkastenadresse genügt in der Regel nicht.
- [ ] Datenschutzerklärung: Hoster, Formulardienst und E-Mail-Anbieter eintragen und von einem Datenschutz-Generator oder anwaltlich prüfen lassen.
- [ ] **Auftragsverarbeitungsverträge** (AVV/DPA) mit Formulardienst, E-Mail-Anbieter und, falls angeboten, mit dem Hoster abschließen und ablegen.
- [ ] Anschrift der Berliner Datenschutzbeauftragten in der Datenschutzerklärung prüfen.
- [ ] **Werbung:** Texte auf Heilsversprechen, Superlative und Angstappelle durchsehen (Heilmittelwerbegesetz, Berufsordnung). Die Entwürfe sind bewusst sachlich gehalten.

## C. Selbsteinschätzungen (fachliche Prüfung)

Die Fragebögen in `inhalte/selbsttests/` sind **eigene, nicht validierte** Formulierungen. Sie sollen nur orientieren.

- [ ] Fragen fachlich prüfen: verständlich, eindeutig, passend für Zielgruppe und Altersangaben?
- [ ] **Schwellenwerte** (`max_summe`) und Hochstufungsregeln (`hochstufen`) fachlich festlegen. Die Startwerte sind Setzungen:
  - ADHS: 0–7 / 8–14 / 15–24
  - Intelligenz: 0–5 / 6–12 / 13–24, mindestens „mittel“ bei Nachweisbedarf oder fachlicher Empfehlung
  - Klinisch selbst: 0–8 / 9–19 / 20–39, mindestens „mittel“ bei Hinweisen auf gehobene Stimmung, ungewöhnliche Wahrnehmungen, Essensthemen oder deutliche Beeinträchtigung
  - Klinisch Eltern: 0–8 / 9–18 / 19–36, mindestens „mittel“ bei Essensthemen oder deutlicher Beeinträchtigung
- [ ] Die Entscheidung bestätigen, **keine Frage zu Suizidgedanken** aufzunehmen. Stattdessen erscheint der Krisenhinweis immer.
- [ ] Ergebnistexte gegenlesen: keine Diagnose, keine Dramatisierung, klare Einladung zum Kontakt.
- [ ] Validierte Fragebögen (z. B. bekannte ADHS-Screenings) nur mit Lizenz bzw. Freigabe der Rechteinhaber verwenden.

## D. Inhalte

- [ ] Alle Platzhalter gefüllt (`npm run platzhalter`): Preise, Dauer, Testdauer, Berufsbezeichnungen, Antwortzeit, Stand der Datenschutzerklärung.
- [ ] Startseite: Den Absatz „Wir sind zu zweit … zwei fachliche Perspektiven“ nur stehen lassen, wenn ihr Befunde tatsächlich gemeinsam besprecht.
- [ ] Lebensläufe korrekt (Studienorte, Zeiträume). Die optionale Zeile zur Psychotherapieausbildung bei Bedarf aktivieren.
- [ ] **Krisennummern** im Krisenhinweis (`ui.yaml`) auf Aktualität prüfen.
- [ ] Englische Fassungen gegenlesen, besonders die Rechtstexte und Selbsttests.
- [ ] Gutachten-Abschnitt: Formulierung „in Vorbereitung“ noch passend?

## E. Technik

- [ ] Testanfrage über das Formular senden: Kommt sie in `anfragen@mentis.uno` an? Funktioniert die Erfolgsmeldung?
- [ ] Alle sechs Selbsttests einmal durchklicken, auf Deutsch und Englisch.
- [ ] Auf dem Smartphone ansehen, inklusive der Leiste „Termin anfragen“ unten.
- [ ] Mit der Tastatur bedienen (Tab, Enter, Esc): Menü, Dialog, Tests, Formular.
- [ ] Browser-Entwicklertools → Netzwerk: Beim Seitenaufruf darf nichts von fremden Servern geladen werden.
- [ ] `npm run check:livegang` läuft fehlerfrei durch.
