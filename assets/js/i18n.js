/* Idioma: los dos textos viven en el HTML, aqui solo se decide cual se ve.
   Sin JS la pagina se queda en ingles, que es el estado del marcado. */

const KEY = 'pdm-lang';
const root = document.documentElement;

const LABEL = {
  es: { btn: 'EN', aria: 'Switch to English', theme: 'Cambiar tema' },
  en: { btn: 'ES', aria: 'Cambiar a español', theme: 'Toggle theme' }
};

let current = 'en';

function paint(lang) {
  current = lang;
  root.lang = lang;
  root.dataset.lang = lang;

  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.textContent = LABEL[lang].btn;
    btn.setAttribute('aria-label', LABEL[lang].aria);
  }
  const theme = document.getElementById('themeBtn');
  if (theme) theme.setAttribute('aria-label', LABEL[lang].theme);

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function stored() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch (_) { /* modo privado o storage bloqueado */ }
  return 'en';                // el ingles es el idioma base del sitio
}

export function lang() {
  return current;
}

export function initI18n() {
  paint(stored());

  const btn = document.getElementById('langBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = current === 'es' ? 'en' : 'es';
    paint(next);
    try { localStorage.setItem(KEY, next); } catch (_) { /* no pasa nada */ }
  });
}
