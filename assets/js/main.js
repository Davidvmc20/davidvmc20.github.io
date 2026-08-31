/* Punto de entrada. Todo lo que hay aqui es aditivo: la pagina se lee entera
   con el JS desactivado. */

import { initI18n } from './i18n.js';
import { initDates } from './career.js';
import { initNav } from './nav.js';
import { initChart } from './charts.js';
import { initTiles } from './render.js';
import { initTerminal } from './terminal.js';
import { initCerts } from './certs.js';
import { initForm } from './form.js';

/* --- Tema: manual gana sobre la preferencia del sistema ------------------- */

function initTheme() {
  const root = document.documentElement;
  const KEY = 'pdm-theme';

  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (_) { /* storage bloqueado */ }

  document.getElementById('themeBtn')?.addEventListener('click', () => {
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const now = root.dataset.theme || (dark ? 'dark' : 'light');
    const next = now === 'dark' ? 'light' : 'dark';

    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#0d1117' : '#ffffff');
    try { localStorage.setItem(KEY, next); } catch (_) { /* ignorar */ }
  });
}

/* --- Foto de perfil con respaldo ----------------------------------------- */

function initAvatar() {
  const img = document.getElementById('avatar');
  const fb = document.getElementById('avatarFb');
  if (!img || !fb) return;

  const swap = () => { img.hidden = true; fb.hidden = false; };
  img.addEventListener('error', swap);
  if (img.complete && img.naturalWidth === 0) swap();
}

/* --- Arranque ------------------------------------------------------------ */

initI18n();
initDates();
initTheme();
initAvatar();
initNav();
initTerminal();
initForm();
initTiles();
initChart();
initCerts();
