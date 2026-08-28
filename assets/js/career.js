/* Fuente unica de todo lo que envejece solo.

   Cambie CAREER_START una sola vez y se recalculan: el contador de la
   seccion 06, la frase de "about", la fecha de corte del grafico y el ano
   del footer. Los anos por tecnologia salen del campo "since" de
   data/stack.json, no de aqui.

   El HTML trae los valores de hoy escritos a mano como respaldo, para que
   la pagina siga siendo correcta con el JS desactivado. Reviselos si la
   deja sin actualizar mucho tiempo. */

export const CAREER_START = 2019;   // primer ano trabajando en TI

const MONTHS = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
       'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
       'August', 'September', 'October', 'November', 'December']
};

/** Anos completos transcurridos desde un ano dado. */
export function yearsSince(from, now = new Date()) {
  return Math.max(now.getFullYear() - Number(from), 0);
}

/** Anos de experiencia en TI. */
export function yearsInIT(now = new Date()) {
  return yearsSince(CAREER_START, now);
}

/** "agosto de 2026" / "August 2026" */
function asOf(lang, now = new Date()) {
  const month = MONTHS[lang][now.getMonth()];
  return lang === 'es' ? `${month} de ${now.getFullYear()}` : `${month} ${now.getFullYear()}`;
}

export function initDates() {
  const now = new Date();

  for (const el of document.querySelectorAll('[data-years]')) {
    el.textContent = yearsInIT(now);
  }

  for (const el of document.querySelectorAll('[data-asof]')) {
    const owner = el.closest('[lang]');
    const lang = owner && owner.lang === 'es' ? 'es' : 'en';
    el.textContent = asOf(lang, now);
  }

  const year = document.getElementById('year');
  if (year) year.textContent = now.getFullYear();
}
