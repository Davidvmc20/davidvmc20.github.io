/* Barras horizontales en SVG inline, sin librerias.
   Se dibuja con 1 unidad SVG = 1 px para que el texto no se deforme al escalar. */

import { yearsSince } from './career.js';

const NS = 'http://www.w3.org/2000/svg';
const ROW = 30;        // fila ancha: etiqueta y barra en la misma linea
const ROW_NARROW = 44; // fila angosta: etiqueta encima de la barra
const BAR = 9;
const VAL_W = 30;
const STACK_AT = 560;  // por debajo de esto la etiqueta no cabe al lado

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let data = [];
let filter = 'all';
let wrap = null;

function el(name, attrs) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

function draw() {
  if (!wrap) return;

  const rows = data.filter(d => filter === 'all' || d.cat === filter);
  if (!rows.length) return;

  const total = Math.max(wrap.clientWidth - 32, 280);
  const stacked = total < STACK_AT;

  const rowH = stacked ? ROW_NARROW : ROW;
  const trackX = stacked ? 0 : 210;
  const trackW = Math.max(total - trackX - VAL_W, 40);
  const barY = stacked ? 24 : 11;

  const max = Math.max(...data.map(d => d.years));
  const height = rows.length * rowH + 4;

  const next = el('svg', {
    width: total, height,
    viewBox: `0 0 ${total} ${height}`,
    'aria-hidden': 'true', focusable: 'false'
  });

  rows.forEach((d, i) => {
    const y = i * rowH;

    const label = el('text', { x: 0, y: y + (stacked ? 13 : 19), class: 'chart-label' });
    label.textContent = d.label;
    next.appendChild(label);

    next.appendChild(el('rect', {
      x: trackX, y: y + barY, width: trackW, height: BAR, rx: 4.5, class: 'chart-track'
    }));

    const bar = el('rect', {
      x: trackX, y: y + barY, height: BAR, rx: 4.5, class: `chart-bar c-${d.cat}`
    });
    bar.style.width = reduce ? `${(d.years / max) * trackW}px` : '0px';
    next.appendChild(bar);

    const val = el('text', {
      x: total, y: y + (stacked ? 13 : 19), class: 'chart-val', 'text-anchor': 'end'
    });
    val.textContent = d.years;
    next.appendChild(val);
  });

  // Se borra siempre lo que hubiera y se vuelve a insertar: si se guardara la
  // referencia anterior y esta ya estuviera fuera del DOM, replaceWith no
  // haria nada y el grafico quedaria en blanco.
  wrap.querySelector('svg')?.remove();
  wrap.appendChild(next);

  if (reduce) return;
  requestAnimationFrame(() => {
    rows.forEach((d, i) => {
      const bar = next.querySelectorAll('.chart-bar')[i];
      if (bar) bar.style.width = `${(d.years / max) * trackW}px`;
    });
  });
}

function initFilters() {
  const bar = document.getElementById('chartFilters');
  if (!bar) return;

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;

    filter = btn.dataset.cat;
    [...bar.querySelectorAll('.filter')].forEach(b => {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    draw();
  });
}

export async function initChart() {
  wrap = document.getElementById('chartWrap');
  if (!wrap) return;

  try {
    const res = await fetch('data/stack.json');
    if (!res.ok) throw new Error(res.status);
    // "years" solo si viene fijo; lo normal es calcularlo desde "since".
    data = ((await res.json()).items || []).map(d => ({
      ...d,
      years: d.years ?? yearsSince(d.since)
    }));
  } catch (_) {
    return;                   // se queda la lista estatica del HTML
  }
  if (!data.length) return;

  // La lista del HTML pasa a ser el equivalente accesible de la grafica:
  // se reescribe con los mismos numeros para que no quede desfasada.
  const fallback = document.getElementById('chartFallback');
  if (fallback) {
    fallback.classList.add('sr-only');
    fallback.replaceChildren(...data.map(d => {
      const li = document.createElement('li');
      const val = document.createElement('span');
      val.textContent = d.years;
      li.append(d.label + ' ', val);
      return li;
    }));
  }

  draw();
  initFilters();

  let t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(draw, 160);
  });
}
