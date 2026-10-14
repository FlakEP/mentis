// Listet alle offenen [[PLATZHALTER: …]] in inhalte/ und src/ mit Datei und Zeile auf.
// Aufruf: „npm run platzhalter“ (nur auflisten) bzw. „node scripts/platzhalter.mjs --streng“ (Fehler, wenn welche offen sind).
// Wird auch von astro.config.ts (Warnung nach dem Build) und „npm run check:livegang“ benutzt.
// Auskommentierte Zeilen (# … in YAML bzw. im Kopf von Markdown-Dateien) zählen nicht, sie erscheinen nicht auf der Website.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const MUSTER = /\[\[PLATZHALTER:[^\]]*\]\]/g;
const ORDNER = ['inhalte', 'src'];
const ENDUNGEN = ['.md', '.yaml', '.yml', '.ts', '.astro', '.mjs', '.css'];
// Diese Dateien erklären das Platzhalter-Format nur und enthalten keine echten Platzhalter
const AUSNAHMEN = ['src/lib/text.ts', 'src/lib/text.test.ts', 'src/lib/markdown-plugins.ts'];

function alleDateien(ordner) {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    return statSync(pfad).isDirectory() ? alleDateien(pfad) : [pfad];
  });
}

/** Sucht alle Platzhalter. Ergebnis: Liste mit { datei, zeile, text }. */
export function findePlatzhalter(projektordner = process.cwd()) {
  const treffer = [];
  for (const ordner of ORDNER) {
    for (const pfad of alleDateien(join(projektordner, ordner))) {
      const datei = relative(projektordner, pfad).replaceAll('\\', '/');
      if (!ENDUNGEN.some((endung) => datei.endsWith(endung)) || AUSNAHMEN.includes(datei)) continue;
      const istYaml = /\.ya?ml$/.test(datei);
      let imKopf = false; // Markdown: Bereich zwischen den beiden ---
      readFileSync(pfad, 'utf8')
        .split(/\r?\n/)
        .forEach((zeile, index) => {
          if (datei.endsWith('.md') && zeile.trim() === '---') imKopf = !imKopf;
          const kommentar = (istYaml || imKopf) && zeile.trim().startsWith('#');
          if (kommentar) return;
          for (const fund of zeile.matchAll(MUSTER)) {
            // „[[PLATZHALTER: …]]“ ist nur die Erklärung des Formats in Kommentaren
            if (fund[0] === '[[PLATZHALTER: …]]') continue;
            treffer.push({ datei, zeile: index + 1, text: fund[0] });
          }
        });
    }
  }
  return treffer;
}

// Direkt aufgerufen (npm run platzhalter)?
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const streng = process.argv.includes('--streng');
  const treffer = findePlatzhalter();
  if (treffer.length === 0) {
    console.log('✔ Keine offenen Platzhalter.');
  } else {
    console.log(`${treffer.length} offene Platzhalter:\n`);
    for (const { datei, zeile, text } of treffer) console.log(`  ${datei}:${zeile}  ${text}`);
    console.log('');
  }
  if (streng && treffer.length > 0) {
    console.error('✘ Vor dem Livegang müssen alle Platzhalter ersetzt sein.');
    process.exit(1);
  }
}
