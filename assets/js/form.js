/* Formulario de contacto.

   Sin backend hay dos modos, y el atributo data-demo del <form> decide cual:

   - CON data-demo (estado actual): "send" abre el cliente de correo del
     visitante con el asunto y el mensaje ya escritos, dirigido a MAILTO.
     No aparece ningun aviso en pantalla; el boton simplemente funciona.

   - SIN data-demo: envia con fetch al endpoint de action=. Para activarlo,
     cree un formulario gratis en https://formspree.io, ponga su endpoint en
     action="https://formspree.io/f/SU_ID" y borre data-demo. Si el JS falla,
     el POST nativo del propio <form> sigue funcionando. */

import { lang } from './i18n.js';

const MAILTO = 'dvmcordova@gmail.com';

const T = {
  es: {
    invalid: 'Revise los campos marcados antes de enviar.',
    opening: 'Abriendo su cliente de correo...',
    sending: 'Enviando...',
    ok: 'Mensaje enviado. Le respondo a la brevedad.',
    fail: `No se pudo enviar. Escríbame a ${MAILTO}.`,
    subject: n => `Contacto desde el sitio — ${n}`,
    btn: '$ send',
    btnBusy: '$ sending...'
  },
  en: {
    invalid: 'Please check the highlighted fields before sending.',
    opening: 'Opening your email client...',
    sending: 'Sending...',
    ok: 'Message sent. I will get back to you shortly.',
    fail: `Could not send. Write to me at ${MAILTO}.`,
    subject: n => `Website contact — ${n}`,
    btn: '$ send',
    btnBusy: '$ sending...'
  }
};

export function initForm() {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const btn = document.getElementById('sendBtn');
  if (!form || !msg || !btn) return;

  const say = (text, cls) => {
    msg.textContent = text || '';
    msg.className = `form-msg ${cls || ''}`.trim();
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const t = T[lang()];

    if (!form.checkValidity()) {
      say(t.invalid, 'bad');
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    // Modo sin endpoint: se delega al cliente de correo del visitante.
    if (form.hasAttribute('data-demo')) {
      const name = data.get('name') || '';
      const body = `${data.get('message') || ''}\n\n—\n${name}\n${data.get('email') || ''}`;
      say(t.opening);
      location.href = `mailto:${MAILTO}`
        + `?subject=${encodeURIComponent(t.subject(name))}`
        + `&body=${encodeURIComponent(body)}`;
      setTimeout(() => say(''), 4000);
      return;
    }

    btn.disabled = true;
    btn.textContent = t.btnBusy;
    say(t.sending);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say(t.ok, 'ok');
    } catch (_) {
      say(t.fail, 'bad');
    } finally {
      btn.disabled = false;
      btn.textContent = t.btn;
    }
  });
}
