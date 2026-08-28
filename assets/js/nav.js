/* Nav: marca la seccion visible. El scroll suave lo hace el CSS. */

export function initNav() {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const sections = [...byId.keys()]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  let active = null;

  const setActive = id => {
    if (id === active) return;
    if (active) byId.get(active)?.classList.remove('active');
    active = id;
    byId.get(id)?.classList.add('active');
  };

  const io = new IntersectionObserver(entries => {
    // De las secciones visibles, gana la que este mas arriba en la pagina.
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));

  // Al llegar por un enlace directo, marcar de una vez.
  const hash = location.hash.slice(1);
  if (byId.has(hash)) setActive(hash);
}
