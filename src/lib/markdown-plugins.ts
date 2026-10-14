// Kleine Erweiterungen für die Markdown-Texte aus inhalte/seiten/:
// 1. HTML-Kommentare (<!-- Hinweise für die Inhaber -->) werden entfernt und erscheinen nie auf der Website.
// 2. Einfache Zeilenumbrüche bleiben erhalten (wichtig für Anschriften im Impressum).
// 3. Platzhalter [[PLATZHALTER: …]] bekommen ein <span class="platzhalter"> (im Entwicklungsmodus gelb). Eingebunden in astro.config.ts.

import { PLATZHALTER_MUSTER } from './text';

type Knoten = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Knoten[];
};

const istKommentar = (knoten: Knoten) =>
  knoten.type === 'html' && /^\s*<!--[\s\S]*-->\s*$/.test(knoten.value ?? '');

/** Remark-Plugin: entfernt HTML-Kommentare aus dem Markdown. */
export function remarkKommentareEntfernen() {
  const durchlaufe = (knoten: Knoten) => {
    if (!knoten.children) return;
    knoten.children = knoten.children.filter((kind) => !istKommentar(kind));
    knoten.children.forEach(durchlaufe);
  };
  return (baum: Knoten) => durchlaufe(baum);
}

/** Remark-Plugin: macht aus einem einfachen Zeilenumbruch im Text einen echten Umbruch (<br>). */
export function remarkZeilenumbrueche() {
  const durchlaufe = (knoten: Knoten) => {
    if (!knoten.children) return;
    knoten.children = knoten.children.flatMap((kind): Knoten[] => {
      if (kind.type !== 'text' || !kind.value?.includes('\n')) {
        durchlaufe(kind);
        return [kind];
      }
      return kind.value
        .split(/\r?\n/)
        .flatMap((zeile, index): Knoten[] => [
          ...(index > 0 ? [{ type: 'break' }] : []),
          ...(zeile ? [{ type: 'text', value: zeile }] : []),
        ]);
    });
  };
  return (baum: Knoten) => durchlaufe(baum);
}

/** Rehype-Plugin: setzt Platzhalter in <span class="platzhalter">. Gelb markiert wird nur im Entwicklungsmodus (global.css). */
export function rehypePlatzhalterMarkieren() {
  const durchlaufe = (knoten: Knoten) => {
    if (!knoten.children || knoten.tagName === 'script' || knoten.tagName === 'style') return;
    knoten.children = knoten.children.flatMap((kind): Knoten[] => {
      if (kind.type !== 'text' || !kind.value) {
        durchlaufe(kind);
        return [kind];
      }
      const teile = kind.value.split(new RegExp(`(${PLATZHALTER_MUSTER.source})`, 'g'));
      if (teile.length === 1) return [kind];
      return teile
        .filter((teil) => teil !== '')
        .map((teil) =>
          new RegExp(`^${PLATZHALTER_MUSTER.source}$`).test(teil)
            ? {
                type: 'element',
                tagName: 'span',
                properties: { className: ['platzhalter'] },
                children: [{ type: 'text', value: teil }],
              }
            : { type: 'text', value: teil },
        );
    });
  };
  return (baum: Knoten) => durchlaufe(baum);
}
