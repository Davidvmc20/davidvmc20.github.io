/* Terminal de comandos: capa opcional. El bloque llega oculto desde el HTML
   y solo se muestra si este modulo corre, para no dejar un cajón muerto. */

import { lang } from './i18n.js';

const T = {
  es: {
    unknown: c => `comando no reconocido: ${c} — escriba help`,
    cleared: 'sesión limpia.',
    goto: id => `abriendo ${id}...`,
    help: [
      'help        lista de comandos',
      'about       quién soy',
      'skills      stack técnico',
      'experience  trayectoria',
      'education   formación',
      'projects    trabajo representativo',
      'contact     cómo escribirme',
      'cv          versión imprimible',
      'lang        cambia español / inglés',
      'theme       cambia claro / oscuro',
      'clear       limpia la pantalla'
    ],
    whoami: 'David Vladimir Morales Córdova — Application Support & Data Analyst, San Pedro Sula, HN.',
    cv: 'abriendo el diálogo de impresión...'
  },
  en: {
    unknown: c => `command not found: ${c} — type help`,
    cleared: 'session cleared.',
    goto: id => `opening ${id}...`,
    help: [
      'help        list commands',
      'about       who I am',
      'skills      technical stack',
      'experience  career history',
      'education   credentials',
      'projects    representative work',
      'contact     how to reach me',
      'cv          printable version',
      'lang        switch Spanish / English',
      'theme       switch light / dark',
      'clear       clear the screen'
    ],
    whoami: 'David Vladimir Morales Córdova — Application Support & Data Analyst, San Pedro Sula, HN.',
    cv: 'opening the print dialog...'
  }
};

const SECTIONS = ['about', 'experience', 'education', 'skills', 'stack', 'learning', 'projects', 'contact'];

export function initTerminal() {
  const term = document.getElementById('term');
  const body = document.getElementById('termBody');
  const input = document.getElementById('termIn');
  if (!term || !body || !input) return;

  term.hidden = false;

  const line = document.querySelector('.term-line');
  const history = [];
  let cursor = -1;

  const print = (text, cls = '') => {
    const p = document.createElement('p');
    p.className = `term-out ${cls}`.trim();
    p.textContent = text;
    body.insertBefore(p, line);
    body.scrollTop = body.scrollHeight;
  };

  const run = raw => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    const t = T[lang()];
    print(`$ ${raw.trim()}`, 'echo');

    if (cmd === 'clear') {
      [...body.querySelectorAll('.term-out')].forEach(n => n.remove());
      print(t.cleared);
      return;
    }
    if (cmd === 'help' || cmd === '?') { t.help.forEach(l => print(l)); return; }
    if (cmd === 'whoami') { print(t.whoami); return; }
    if (cmd === 'ls') { print(SECTIONS.join('  ')); return; }
    if (cmd === 'cv' || cmd === 'print') { print(t.cv); setTimeout(() => window.print(), 250); return; }
    if (cmd === 'lang') { document.getElementById('langBtn')?.click(); return; }
    if (cmd === 'theme') { document.getElementById('themeBtn')?.click(); return; }

    const target = cmd === 'stats' ? 'stack' : cmd;
    if (SECTIONS.includes(target)) {
      print(t.goto(target));
      document.getElementById(target)?.scrollIntoView({ block: 'start' });
      return;
    }
    print(t.unknown(cmd), 'err');
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const value = input.value;
      if (value.trim()) { history.push(value.trim()); cursor = history.length; }
      run(value);
      input.value = '';
      return;
    }
    if (e.key === 'ArrowUp' && cursor > 0) {
      e.preventDefault();
      input.value = history[--cursor];
    }
    if (e.key === 'ArrowDown' && cursor < history.length - 1) {
      e.preventDefault();
      input.value = history[++cursor];
    }
  });
}
