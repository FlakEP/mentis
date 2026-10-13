# Anleitung: Von diesem Startpaket zur fertigen Website

Diese Anleitung führt dich Schritt für Schritt durch alles, was nötig ist. Die eigentliche Programmierarbeit übernimmt Claude Code. Du richtest es ein, prüfst die Ergebnisse und triffst die Entscheidungen.

**Inhalt des Pakets**

| Datei / Ordner | Wofür |
|---|---|
| `CLAUDE.md` | Regeln, die Claude Code in jeder Sitzung automatisch liest |
| `SPEZIFIKATION.md` | vollständige Bauanleitung für die Website |
| `START-PROMPT.md` | die Texte, die du in Claude Code einfügst |
| `inhalte/` | alle Seitentexte, Selbsttests und globalen Texte – hier änderst du später Inhalte |
| `logo/` | Logo, Favicon und eine Vorschau (`logo-vorschau.png`) |
| `PRUEFLISTE-VOR-LIVEGANG.md` | fachliche und rechtliche Punkte, die ihr vor der Veröffentlichung klären solltet |

---

## Schritt 1: Voraussetzungen installieren (einmalig)

1. **Node.js** (aktuelle LTS-Version) von https://nodejs.org installieren. Die Website wird damit gebaut.
2. **Git** von https://git-scm.com installieren. Damit wird der Code versioniert und später veröffentlicht. Unter Windows bringt „Git for Windows“ zusätzlich eine Bash-Umgebung mit, die Claude Code nutzt.
3. **Claude Code** installieren. Öffne dazu ein Terminal und füge diesen Befehl ein:
   - macOS / Linux:
     ```
     curl -fsSL https://claude.ai/install.sh | bash
     ```
   - Windows (PowerShell):
     ```
     irm https://claude.ai/install.ps1 | iex
     ```
   Öffne danach ein **neues** Terminalfenster und prüfe mit `claude --version`, ob die Installation geklappt hat. Es sollte eine Versionsnummer erscheinen.

## Schritt 2: Projektordner anlegen

1. Entpacke die ZIP-Datei an einen Ort deiner Wahl, zum Beispiel nach `Dokumente/Projekte`.
2. Der entstandene Ordner `mentis-uno-startpaket` ist euer Projektordner. Ihr könnt ihn umbenennen, zum Beispiel in `mentis-uno`. `CLAUDE.md` muss direkt darin liegen, nicht in einem weiteren Unterordner.
3. Öffne ein Terminal in diesem Ordner:
   - Windows: Ordner im Explorer öffnen, in die Adresszeile `powershell` tippen und Enter drücken.
   - macOS: Terminal öffnen, `cd ` tippen (mit Leerzeichen), den Ordner ins Fenster ziehen und Enter drücken.

## Schritt 3: Claude Code mit deinen API-Credits verbinden

1. Tippe im Terminal `claude` und drücke Enter.
2. Beim ersten Start öffnet sich der Browser zur Anmeldung. Wähle das **Anthropic-Console-Konto**, nicht das Claude.ai-Abo, und dann **„Sign in with your Console account (recommended)“**. Danach laufen die Kosten über dein Console-Guthaben.
3. Prüf in Claude Code mit `/status`, ob die Console-Anmeldung aktiv ist.
4. Leg in der Console (https://platform.claude.com) ein **monatliches Ausgabenlimit** fest. Dann bleiben die Kosten planbar.

Hinweis: Ist auf deinem Rechner die Umgebungsvariable `ANTHROPIC_API_KEY` gesetzt, fragt Claude Code stattdessen, ob es diesen Schlüssel verwenden soll. Das funktioniert ebenfalls über die Credits.

**Nützliche Befehle in Claude Code**
- `/usage`: zeigt den bisherigen Verbrauch
- `/model`: Modell wechseln. Für Gestaltung und Grundgerüst lohnt sich das stärkste Modell. Für Kleinkram wie das Eintragen von Platzhaltern reicht ein günstigeres.
- `Esc`: unterbricht Claude Code jederzeit, zum Beispiel wenn es in die falsche Richtung läuft
- Claude Code fragt um Erlaubnis, bevor es Programme installiert oder Befehle ausführt. Lies die Anfragen kurz, bevor du sie bestätigst.

## Schritt 4: Bauen lassen

1. Öffne `START-PROMPT.md`, kopiere den **Startprompt** und füge ihn in Claude Code ein.
2. Claude Code liest alles und zeigt dir einen Plan für Phase 1. Prüf ihn und gib ihn frei.
3. Nach jeder Phase siehst du dir das Ergebnis an. Dazu im Terminal (oder Claude Code bitten):
   ```
   npm run dev
   ```
   und im Browser http://localhost:4321 öffnen.
4. Gib Rückmeldung mit dem Folgeprompt aus `START-PROMPT.md` und lass die nächste Phase umsetzen. Insgesamt sind es sieben Phasen.

Tipp: Wird eine Sitzung sehr lang, starte Claude Code neu (`/exit`, dann `claude`). Die Regeln aus `CLAUDE.md` liest es automatisch wieder ein. Sag ihm einfach, mit welcher Phase es weitergehen soll.

## Schritt 5: Kontaktformular einrichten

Eine statische Website kann selbst keine E-Mails verschicken. Dafür braucht ihr einen **Formulardienst**, der die Anfragen entgegennimmt und an `anfragen@mentis.uno` weiterleitet. Wählt einen Dienst mit Datenspeicherung in der EU und Auftragsverarbeitungsvertrag:

- **Forminit** (früher Getform), Sitz London, Speicherung bei AWS in Irland. Kostenloser Tarif mit 100 Anfragen pro Monat. Der Auftragsverarbeitungsvertrag wird laut Anbieter mit den AGB geschlossen. Reines HTML-Formular ist möglich (Endpunkt `https://forminit.com/f/<Formular-ID>`).
- **nForms**, in Deutschland entwickelt, Speicherung in Frankfurt. Kostenlos bis 100 Anfragen pro Monat, allerdings nur 7 Tage Speicherdauer und mit Branding. Der Dienst ist noch in der Beta. Vorher prüfen, ob der Versand ohne ihr Skript funktioniert.

Vorgehen:
1. Konto anlegen, Formular erstellen, als Empfänger `anfragen@mentis.uno` eintragen, Speicherdauer so kurz wie möglich einstellen.
2. Den Auftragsverarbeitungsvertrag (DPA/AVV) herunterladen bzw. bestätigen und ablegen.
3. Den dritten Prompt aus `START-PROMPT.md` mit dem Endpunkt an Claude Code geben.

**E-Mail-Postfach:** Für `anfragen@mentis.uno` braucht ihr ein Postfach. Viele Domainanbieter haben eins im Paket. Sonst eignet sich ein deutscher Anbieter, z. B. mailbox.org (Berlin), dort sind eigene Domains in den kostenpflichtigen Tarifen möglich.

## Schritt 6: Veröffentlichen (kostenlos bei statichost.eu)

statichost.eu ist ein schwedischer Anbieter für statische Websites mit Servern in der EU. Der kostenlose Tarif „Hobby“ enthält 10 GB Datenvolumen und 100 Build-Minuten pro Monat, eine eigene Domain und automatisches HTTPS. Das reicht für eine Praxis-Website gut aus.

1. **Code auf GitHub (oder GitLab, Codeberg) hochladen.** Bitte Claude Code einfach: „Hilf mir, das Projekt in ein neues GitHub-Repository hochzuladen.“ Im kostenlosen Tarif von statichost.eu muss das Repository **öffentlich** sein; private Repositories gibt es ab dem Starter-Tarif. Das ist unproblematisch, weil die Website-Inhalte ohnehin öffentlich sind. Achtet nur darauf, dass keine privaten Notizen oder Passwörter im Ordner liegen.
2. Bei https://www.statichost.eu registrieren, eine Site anlegen und das Repository verbinden. Build-Befehl: `npm run build`, Ausgabeordner: `dist`.
3. Die Seite ist zuerst unter `<sitename>.statichost.page` erreichbar. Dort gründlich testen.
4. **Domain verbinden:** Beim Domainanbieter von `mentis.uno` folgende DNS-Einträge setzen:
   ```
   www.mentis.uno.   CNAME   <sitename>.statichost.page.
   mentis.uno.       ALIAS   <sitename>.statichost.page.
   ```
   Unterstützt euer Anbieter kein ALIAS bzw. ANAME, findet ihr Alternativen unter https://www.statichost.eu/docs/domains/. Das HTTPS-Zertifikat wird automatisch erstellt.
5. Danach veröffentlicht jede Änderung, die ihr in das Repository hochladet, die Website automatisch neu.

## Schritt 7: Vor dem Livegang

Arbeitet `PRUEFLISTE-VOR-LIVEGANG.md` durch und lasst Claude Code `npm run check:livegang` ausführen. Erst wenn beides erledigt ist, die Domain umstellen.

---

**Später etwas ändern?** Texte, Preise und Fragen stehen in `inhalte/`. Ihr könnt sie direkt in einem Texteditor ändern oder Claude Code bitten, zum Beispiel: „Ändere den Preis für ADHS-Diagnostik auf 480 €.“ Die `README.md`, die Claude Code anlegt, erklärt die häufigsten Änderungen.
