/* Contadores de la seccion 06 desde data/learning.json.
   Si el fetch falla, quedan los valores que ya estan en el HTML.

   Cada entrada trae "value" (texto fijo) o "derive" (valor calculado). */

import { yearsInIT } from './career.js';

const DERIVED = {
  yearsInIT: () => yearsInIT()
};

export async function initTiles() {
  const grid = document.getElementById('tiles');
  if (!grid) return;

  let items;
  try {
    const res = await fetch('data/learning.json');
    if (!res.ok) throw new Error(res.status);
    items = await res.json();
  } catch (_) {
    return;
  }
  if (!Array.isArray(items) || !items.length) return;

  grid.replaceChildren(...items.map(item => {
    const tile = document.createElement('div');
    tile.className = 'tile';

    const value = document.createElement('b');
    const derive = DERIVED[item.derive];
    value.textContent = derive ? derive() : item.value;
    tile.append(value);

    for (const code of ['es', 'en']) {
      if (!item[code]) continue;
      const label = document.createElement('span');
      label.lang = code;
      label.textContent = item[code];
      tile.append(label);
    }
    return tile;
  }));
}
