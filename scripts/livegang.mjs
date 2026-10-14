// Prüfung vor dem Livegang („npm run check:livegang“): schlägt fehl, solange Platzhalter offen sind
// oder der Formular-Endpunkt in src/config/kontaktformular.ts fehlt. Typprüfung und Tests laufen vorher (siehe package.json).

import { readFileSync } from 'node:fs';
import { findePlatzhalter } from './platzhalter.mjs';

let fehler = 0;

const platzhalter = findePlatzhalter();
if (platzhalter.length > 0) {
  console.error(`✘ ${platzhalter.length} Platzhalter sind noch offen (Liste: npm run platzhalter).`);
  fehler++;
} else {
  console.log('✔ Keine offenen Platzhalter.');
}

const seiteneinstellungen = readFileSync('src/config/site.ts', 'utf8');
if (/WARTUNGSMODUS\s*=\s*true/.test(seiteneinstellungen)) {
  console.error('✘ Der Wartungsmodus ist eingeschaltet – online ist nur die Platzhalterseite (src/config/site.ts → WARTUNGSMODUS).');
  fehler++;
} else {
  console.log('✔ Wartungsmodus aus – die vollständige Website wird veröffentlicht.');
}

const konfiguration = readFileSync('src/config/kontaktformular.ts', 'utf8');
const endpunkt = konfiguration.match(/FORMULAR_ENDPUNKT\s*=\s*['"`]([^'"`]*)['"`]/)?.[1]?.trim() ?? '';
if (!endpunkt) {
  console.error('✘ Der Formular-Endpunkt ist leer (src/config/kontaktformular.ts → FORMULAR_ENDPUNKT).');
  fehler++;
} else {
  console.log(`✔ Formular-Endpunkt eingetragen: ${endpunkt}`);
}

if (fehler > 0) {
  console.error('\nDie Website ist noch nicht bereit für den Livegang.');
  process.exit(1);
}
console.log('\n✔ Bereit für den Livegang (bitte zusätzlich PRUEFLISTE-VOR-LIVEGANG.md durchgehen).');
