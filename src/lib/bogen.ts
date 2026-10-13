// Geometrie der zwei Kreisbögen aus der Bildmarke (logo/bildmarke.svg).
// Wird von Bogen-Deko, Ablauf-Ziffern, Hero-Komposition und später den Initialen-Avataren benutzt.

/**
 * Maße der Bildmarke in Grad (0° = rechts, im Uhrzeigersinn wie in SVG).
 * Im Logo beginnt der grüne Bogen links unten (131°) und läuft 158° weit
 * im Uhrzeigersinn bis oben. Danach folgt eine Lücke von 22°, dann der
 * Terrakotta-Bogen, wieder 158° lang, und noch eine Lücke von 22°.
 */
export const BILDMARKE = {
  startGrad: 131,
  spanneGrad: 158,
  lueckeGrad: 22,
} as const;

const rund = (zahl: number) => Math.round(zahl * 100) / 100;

/** Punkt auf einem Kreis. */
export function punktAufKreis(cx: number, cy: number, r: number, grad: number) {
  const bogenmass = (grad * Math.PI) / 180;
  return { x: rund(cx + r * Math.cos(bogenmass)), y: rund(cy + r * Math.sin(bogenmass)) };
}

/** SVG-Pfad (Attribut d) für einen Kreisbogen im Uhrzeigersinn. */
export function bogenPfad(cx: number, cy: number, r: number, startGrad: number, spanneGrad: number): string {
  const a = punktAufKreis(cx, cy, r, startGrad);
  const b = punktAufKreis(cx, cy, r, startGrad + spanneGrad);
  const grosserBogen = spanneGrad > 180 ? 1 : 0;
  return `M${a.x} ${a.y}A${r} ${r} 0 ${grosserBogen} 1 ${b.x} ${b.y}`;
}

/**
 * Die beiden Bögen der Bildmarke als Pfade: [grüner Bogen, Terrakotta-Bogen].
 * `drehung` dreht das Paar um die Mitte (in Grad), `spanneFaktor` verkürzt beide Bögen
 * gleichmäßig (1 = wie im Logo) und vergrößert dabei die Lücken.
 */
export function bogenPaar(
  cx: number,
  cy: number,
  r: number,
  drehung = 0,
  spanneFaktor = 1,
): [string, string] {
  const spanne = BILDMARKE.spanneGrad * spanneFaktor;
  // Bögen bleiben um dieselben Mittelpunkte zentriert wie im Logo
  const versatz = (BILDMARKE.spanneGrad - spanne) / 2;
  const start1 = BILDMARKE.startGrad + drehung + versatz;
  const start2 = start1 + BILDMARKE.spanneGrad + BILDMARKE.lueckeGrad;
  return [bogenPfad(cx, cy, r, start1, spanne), bogenPfad(cx, cy, r, start2, spanne)];
}
