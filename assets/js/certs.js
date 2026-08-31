/* Seccion 07: certificados, desde data/certificados.json.
   Cada categoria es un boton; al abrirla, un modal lista sus certificados.
   Si el fetch falla se queda el resumen estatico del HTML, igual que hace
   la grafica del stack con su lista de respaldo.

   Cada certificado trae "n" (el titulo con que se emitio) y, cuando aplica,
   "n_en" con su traduccion. Los que ya venian en ingles no llevan n_en. */

const MESES = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

let items = [];
let cats = [];
let abierta = null;          // categoria abierta, para repintar al cambiar idioma
let devolverFoco = null;     // a donde vuelve el foco al cerrar

function lang() {
  return document.documentElement.dataset.lang === 'es' ? 'es' : 'en';
}

/* 7 certificados no traen fecha en el documento: se muestran sin ella */
function fecha(d) {
  if (!d) return '';
  return `${MESES[lang()][+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`;
}

/* El titulo traducido solo existe para los que no venian ya en ingles */
function nombre(c) {
  return lang() === 'en' && c.n_en ? c.n_en : c.n;
}

/* Los dos idiomas dentro del elemento, como el resto del sitio */
function bilingue(es, en) {
  const frag = document.createDocumentFragment();
  for (const [code, text] of [['es', es], ['en', en]]) {
    const span = document.createElement('span');
    span.lang = code;
    span.textContent = text;
    frag.append(span);
  }
  return frag;
}

/* --- Modal --------------------------------------------------------------- */

function pintarModal() {
  if (!abierta) return;

  const title = document.getElementById('certModalTitle');
  const body = document.getElementById('certModalBody');
  if (!title || !body) return;

  const lista = items.filter(c => c.cat === abierta.key);
  const n = lista.length;

  title.replaceChildren(bilingue(
    `${abierta.es} · ${n} ${n === 1 ? 'certificado' : 'certificados'}`,
    `${abierta.en} · ${n} ${n === 1 ? 'certificate' : 'certificates'}`
  ));

  body.replaceChildren(...lista.map(c => {
    const item = document.createElement('article');
    item.className = 'cert-item';

    const name = document.createElement('p');
    name.className = 'cert-name';
    name.textContent = nombre(c);

    const meta = document.createElement('p');
    meta.className = 'cert-meta';
    meta.textContent = c.d ? `${c.p} · ${fecha(c.d)}` : c.p;

    item.append(name, meta);
    return item;
  }));
}

function abrir(cat, origen) {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  abierta = cat;
  devolverFoco = origen || null;
  pintarModal();

  modal.hidden = false;
  document.body.classList.add('modal-open');
  document.getElementById('certModalBody').scrollTop = 0;
  document.getElementById('certModalClose')?.focus();
}

function cerrar() {
  const modal = document.getElementById('certModal');
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  document.body.classList.remove('modal-open');
  abierta = null;
  devolverFoco?.focus();
  devolverFoco = null;
}

function initModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  document.getElementById('certModalClose')?.addEventListener('click', cerrar);

  // clic fuera de la caja
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrar();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
  });
}

/* --- Rejilla de categorias ------------------------------------------------ */

function pintarCategorias() {
  const grid = document.getElementById('certsCats');
  if (!grid || !cats.length) return;

  grid.replaceChildren(...cats.map(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat';
    btn.type = 'button';

    const name = document.createElement('span');
    name.className = 'cat-name';
    name.append(bilingue(cat.es, cat.en));

    const count = document.createElement('span');
    count.className = 'cat-n';
    count.textContent = cat.n;

    btn.append(name, count);
    btn.addEventListener('click', () => abrir(cat, btn));
    return btn;
  }));

  grid.hidden = false;
}

function pintarTiles() {
  const grid = document.getElementById('certTiles');
  if (!grid) return;

  const emisores = new Set(items.map(c => c.p)).size;

  const datos = [
    [String(items.length), 'certificados', 'certificates'],
    [String(cats.length), 'categorías', 'categories'],
    [String(emisores), 'emisores', 'issuers']
  ];

  grid.replaceChildren(...datos.map(([value, es, en]) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const b = document.createElement('b');
    b.textContent = value;
    tile.append(b, bilingue(es, en));
    return tile;
  }));
}

export async function initCerts() {
  const grid = document.getElementById('certsCats');
  if (!grid) return;

  let data;
  try {
    const res = await fetch('data/certificados.json');
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  } catch (_) {
    return;                   // se queda el resumen estatico del HTML
  }

  items = Array.isArray(data.items) ? data.items : [];
  cats = Array.isArray(data.categories) ? data.categories : [];
  if (!items.length) return;

  document.getElementById('certsFallback')?.remove();

  pintarTiles();
  pintarCategorias();
  initModal();

  // las fechas del modal cambian de idioma con el resto del sitio
  document.addEventListener('langchange', pintarModal);
}
