/* =========================================================
   Premium Skin Test — lógica del formulario (JS vanilla)
   Autora del test: Lorena Navarro · Marca: Ringana
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURACIÓN
   --------------------------------------------------------- */
const CONFIG = {
  // ▸ Pega aquí la URL de tu Web App de Google Apps Script.
  //   (Apps Script → Implementar → Aplicación web → copiar URL "/exec")
  //   Ejemplo: 'https://script.google.com/macros/s/AKfy.....xxxx/exec'
  //   Déjala vacía y el test funciona igual: guarda en localStorage.
  SHEETS_WEBAPP_URL: '',

  // Enlace a la política de privacidad (placeholder, cámbialo por el real).
  PRIVACY_URL: '#politica-de-privacidad', // // TODO revisar: poner URL real
};

/* ---------------------------------------------------------
   DATOS: preguntas puntuadas P1–P15 (opción única)
   El número "p" son los puntos que suma esa respuesta.
   --------------------------------------------------------- */
const SCORED = [
  { id: 'p1', q: '¿Cuál es tu rango de edad?', options: [
    { t: 'Menos de 25 años', p: 0 },
    { t: 'Entre 26 y 35 años', p: 1 },
    { t: 'Entre 36 y 45 años', p: 2 },
    { t: 'Entre 46 y 55 años', p: 3 },
    { t: 'Más de 55 años', p: 4 },
  ]},
  { id: 'p2', q: '¿Vas al solárium o tomas el sol?', options: [
    { t: 'Nunca', p: 0 },
    { t: 'Ocasionalmente', p: 1 },
    { t: 'A menudo', p: 2 },
  ]},
  { id: 'p3', q: '¿Trabajas en sitios cerrados?', options: [
    { t: 'Sí', p: 1 },
    { t: 'No', p: 0 },
  ]},
  { id: 'p4', q: 'Cuando te echas cremas, ¿qué sensación prefieres en tu piel?', options: [
    { t: 'Que se absorba rápido y apenas se note', p: 0 },
    { t: 'Una textura más nutritiva, sensación de confort', p: 2 },
    { t: 'Una película protectora que se sienta', p: 3 },
  ]},
  { id: 'p5', q: '¿Consumes alcohol?', options: [
    { t: 'Nunca', p: 0 },
    { t: 'Ocasionalmente', p: 1 },
    { t: 'Con regularidad', p: 2 },
  ]},
  { id: 'p6', q: '¿Tu piel tiene impurezas?', options: [
    { t: 'Sí', p: 0 },
    { t: 'No', p: 1 },
  ]},
  { id: 'p7', q: '¿Tu piel tiende a formar arrugas?', options: [
    { t: 'Sí', p: 2 },
    { t: 'No', p: 0 },
  ]},
  { id: 'p8', q: '¿Vives en la ciudad?', options: [
    { t: 'Sí', p: 1 },
    { t: 'No', p: 0 },
  ]},
  { id: 'p9', q: '¿Cuánto deporte realizas a la semana?', options: [
    { t: 'Más de una hora', p: 0 },
    { t: 'Entre 30 y 60 minutos', p: 1 },
    { t: 'Menos de 30 minutos', p: 2 },
  ]},
  { id: 'p10', q: '¿Con qué te sientes más identificada?', options: [
    { t: 'Peso bajo', p: 2 },
    { t: 'Peso normal', p: 0 },
    { t: 'Sobrepeso', p: 1 },
  ]},
  { id: 'p11', q: '¿Pasas varias horas al día en espacios climatizados?', options: [
    { t: 'Sí', p: 1 },
    { t: 'No', p: 0 },
  ]},
  { id: 'p12', q: '¿Cuidas tu alimentación? (verduras, frutas, productos integrales...)', options: [
    { t: 'Sí', p: 0 },
    { t: 'A veces', p: 1 },
    { t: 'No', p: 2 },
  ]},
  { id: 'p13', q: '¿Fumas?', options: [
    { t: 'No', p: 0 },
    { t: 'Menos de 10 cigarrillos al día', p: 1 },
    { t: 'Más de 10 cigarrillos al día', p: 2 },
  ]},
  { id: 'p14', q: '¿Tu piel tiene los poros grandes?', options: [
    { t: 'Sí', p: 0 },
    { t: 'No', p: 1 },
  ]},
  { id: 'p15', q: '¿Tu piel se enrojece o se irrita fácilmente?', options: [
    { t: 'Sí', p: 2 },
    { t: 'No', p: 0 },
  ]},
];
// Puntuación máxima posible: 30.

/* ---------------------------------------------------------
   DATOS: personalización de rutina P20–P23
   Cada opción apunta a uno o varios productos Ringana.
   --------------------------------------------------------- */
const PERSO_SINGLE = {
  p20: { q: '¿Cómo describirías tu piel en cuanto a sensibilidad?', options: [
    { t: 'Muy sensible, se irrita con facilidad', prod: ['tonic calm'] },
    { t: 'No es especialmente sensible, pero tiende a granitos', prod: ['tonic pure'] },
  ]},
  p21: { q: '¿Qué prioridad tienes ahora mismo para tu piel?', options: [
    { t: 'Hidratación profunda y equilibrio', prod: ['hydro serum'] },
    { t: 'Tratar arrugas y firmeza', prod: ['hydro serum', 'anti wrinkle'] },
  ]},
  p22: { q: 'Por las noches, ¿tu piel tolera bien activos más potentes?', options: [
    { t: 'Sí, los tolera bien', prod: ['overnight'] },
    { t: 'No, reacciona o tengo rosácea/sensibilidad alta', prod: ['skin perfection'] },
  ]},
};

const P23 = {
  q: 'De esta lista, ¿qué te interesaría conseguir con tu piel?',
  hint: 'Puedes elegir varias opciones (al menos una).',
  options: [
    { t: 'Reducir o prevenir arrugas / mejorar firmeza', prod: ['adds effect'] },
    { t: 'Aportar luminosidad y unificar el tono', prod: ['adds glow'] },
    { t: 'Reparar y calmar irritaciones o rojeces', prod: ['adds repair'] },
    { t: 'Cuidar e hidratar el contorno de ojos', prod: ['eye serum'] },
  ],
};

/* ---------------------------------------------------------
   DATOS: textos de las páginas de resultado (sección 8)
   --------------------------------------------------------- */
const RESULTS = {
  Grasa: {
    // // TODO revisar: (BORRADOR)
    emoji: '🌿',
    titulo: 'Piel Grasa',
    parrafos: [
      'Tu piel tiende a producir más sebo del necesario: notas brillos y los poros más visibles, sobre todo en la zona T. Lo que necesita no es agresividad, sino equilibrio: limpiar y regular sin resecar, porque una piel grasa deshidratada produce todavía más grasa. El objetivo es purificar y matificar manteniendo intacta la barrera de tu piel.',
      'Con esta información es posible comprender mejor el comportamiento de tu piel y diseñar una rutina personalizada para ti.',
    ],
  },
  Mixta: {
    // TEXTO ORIGINAL, no tocar
    emoji: '🌿',
    titulo: 'Piel Mixta',
    parrafos: [
      'Seguramente tu piel presenta zonas más grasas (en la zona T) y otras más secas. Cada área requiere un cuidado específico que evite tanto la sobrecarga como la deshidratación, favoreciendo un balance estable.',
      'El equilibrio es un aspecto clave para tu piel.',
      'Con esta información es posible comprender mejor el comportamiento de tu piel y diseñar una rutina personalizada para ti.',
    ],
  },
  Seca: {
    // // TODO revisar: (BORRADOR)
    emoji: '🌿',
    titulo: 'Piel Seca',
    parrafos: [
      'Tu piel tiende a la sequedad: puede notarse tirante, apagada o con alguna descamación. Le faltan tanto agua como lípidos, así que agradece una nutrición e hidratación profundas y constantes para recuperar confort y luminosidad. El objetivo es reforzar la barrera y sellar la hidratación durante todo el día.',
      'Con esta información es posible comprender mejor el comportamiento de tu piel y diseñar una rutina personalizada para ti.',
    ],
  },
};

/* ---------------------------------------------------------
   ESTADO
   --------------------------------------------------------- */
const state = {
  contacto: { nombre: '', email: '', telefono: '+34 ' },
  scored: {},   // { p1: {label, points}, ... }
  abiertas: { p16: '', p17: '', p18: '', p19: '' },
  perso: { p20: null, p21: null, p22: null, p23: [] }, // p20-p22: índice; p23: array de índices
  consent: false,
};

let currentIndex = 0;

/* ---------------------------------------------------------
   DEFINICIÓN DE PANTALLAS (en orden del spec, sección 1)
   --------------------------------------------------------- */
const VIEWS = [];

// 1. Portada
VIEWS.push({ id: 'cover', progress: false, render: renderCover });
// 2. Datos de contacto
VIEWS.push({ id: 'contact', render: renderContact });
// 3. Intro tipo de piel
VIEWS.push({ id: 'intro', render: renderIntro });
// 4. P1–P15
SCORED.forEach((qq) => VIEWS.push({ id: qq.id, render: () => renderScored(qq) }));
// 5. Abiertas informativas P16, P17
VIEWS.push({ id: 'informativas', render: renderInformativas });
// 6-7. Cálculo + página de resultado
VIEWS.push({ id: 'result', render: renderResult });
// 8. Personalización P20, P21, P22
VIEWS.push({ id: 'p20', render: () => renderPersoSingle('p20') });
VIEWS.push({ id: 'p21', render: () => renderPersoSingle('p21') });
VIEWS.push({ id: 'p22', render: () => renderPersoSingle('p22') });
// P23 (múltiple)
VIEWS.push({ id: 'p23', render: renderP23 });
// 9. Abiertas finales P18, P19 + consentimiento + Enviar
VIEWS.push({ id: 'finales', render: renderFinales });
// 10. Agradecimiento
VIEWS.push({ id: 'thanks', progress: false, render: renderThanks });

/* ---------------------------------------------------------
   REFERENCIAS DOM + arranque
   --------------------------------------------------------- */
const appEl = document.getElementById('app');
const backBtn = document.getElementById('backBtn');
const progressEl = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

backBtn.addEventListener('click', () => goTo(currentIndex - 1));

document.addEventListener('DOMContentLoaded', () => {
  reintentarEnvioPendiente();
  render();
});

/* ---------------------------------------------------------
   NAVEGACIÓN
   --------------------------------------------------------- */
function goTo(index) {
  if (index < 0 || index >= VIEWS.length) return;
  currentIndex = index;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function next() { goTo(currentIndex + 1); }

function render() {
  const view = VIEWS[currentIndex];

  // Progreso
  const showProgress = view.progress !== false;
  progressEl.hidden = !showProgress;
  if (showProgress) {
    const pct = Math.round((currentIndex / (VIEWS.length - 1)) * 100);
    progressBar.style.width = pct + '%';
  }

  // Botón atrás: visible salvo en portada y agradecimiento
  backBtn.hidden = (view.id === 'cover' || view.id === 'thanks');

  appEl.innerHTML = '';
  const node = view.render();
  appEl.appendChild(node);
}

/* ---------------------------------------------------------
   HELPERS de construcción DOM
   --------------------------------------------------------- */
function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.attrs) for (const k in opts.attrs) node.setAttribute(k, opts.attrs[k]);
  if (opts.on) for (const ev in opts.on) node.addEventListener(ev, opts.on[ev]);
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c) node.appendChild(c);
  });
  return node;
}
const screen = (children) => el('div', { class: 'screen' }, children);
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function primaryButton(label, onClick) {
  return el('button', {
    class: 'btn', attrs: { type: 'button' }, on: { click: onClick },
  }, [
    el('span', { text: label }),
    el('span', { class: 'btn__arrow', html: '→' }),
  ]);
}

/* ---------------------------------------------------------
   PANTALLAS
   --------------------------------------------------------- */

// 2. Portada
function renderCover() {
  const s = screen([
    el('p', { class: 'eyebrow', text: 'Diagnóstico profesional de piel · Lorena Navarro' }),
    el('h1', { class: 'display', text: 'Premium Skin Test' }),
    el('p', { class: 'lead', html: '<strong>Conecta con tu piel.</strong>' }),
    el('p', { class: 'body-text italic', text: 'Tu piel te habla, pero... ¿la escuchas?' }),
    el('p', { class: 'body-text', text: 'Este test te ayudará a mirarla con otros ojos, entender lo que está necesitando y empezar a cuidarla desde la consciencia.' }),
    el('p', { class: 'body-text soft', text: 'Hazlo con calma 🌸✨' }),
    el('div', { class: 'actions' }, [primaryButton('Empezamos', next)]),
  ]);
  return s;
}

// 3. Datos de contacto
function renderContact() {
  const c = state.contacto;

  const nombre = inputField('Nombre y apellidos', 'nombre', c.nombre, { type: 'text', autocomplete: 'name' });
  const email = inputField('Correo electrónico', 'email', c.email, { type: 'email', autocomplete: 'email' });
  const tel = inputField('Número de teléfono', 'telefono', c.telefono, { type: 'tel', autocomplete: 'tel' }, 'Por defecto con prefijo +34.');

  const s = screen([
    el('p', { class: 'eyebrow', text: 'Antes de empezar' }),
    el('h2', { class: 'title', text: 'Tus datos de contacto' }),
    el('p', { class: 'subtitle', text: 'Los necesito para enviarte tu recomendación personalizada.' }),
    nombre.field, email.field, tel.field,
    el('div', { class: 'actions' }, [primaryButton('Siguiente', () => {
      // Sincroniza valores
      c.nombre = nombre.input.value.trim();
      c.email = email.input.value.trim();
      c.telefono = tel.input.value.trim();

      let ok = true;
      if (!c.nombre) { showFieldError(nombre.field, 'Escribe tu nombre y apellidos.'); ok = false; }
      else clearFieldError(nombre.field);

      if (!validarEmail(c.email)) { showFieldError(email.field, 'Introduce un email válido.'); ok = false; }
      else clearFieldError(email.field);

      if (!validarTelefono(c.telefono)) { showFieldError(tel.field, 'Introduce un teléfono válido (9-15 dígitos).'); ok = false; }
      else clearFieldError(tel.field);

      if (ok) next();
    })]),
  ]);
  return s;
}

function inputField(labelText, name, value, attrs = {}, hint) {
  const input = el('input', { attrs: { name, value, ...attrs } });
  const children = [el('label', { text: labelText, attrs: { for: name } }), input];
  if (hint) children.push(el('p', { class: 'hint', text: hint }));
  const errEl = el('p', { class: 'error-msg', attrs: { 'data-err': '1' } });
  errEl.hidden = true;
  children.push(errEl);
  const field = el('div', { class: 'field' }, children);
  return { field, input };
}

function textareaField(labelText, name, value, optional) {
  const ta = el('textarea', { attrs: { name } });
  ta.value = value || '';
  const label = el('label', { attrs: { for: name } }, [
    document.createTextNode(labelText + ' '),
  ]);
  if (optional) label.appendChild(el('span', { class: 'optional', text: '(opcional)' }));
  const field = el('div', { class: 'field' }, [label, ta]);
  return { field, input: ta };
}

function showFieldError(field, msg) {
  field.classList.add('has-error');
  const e = field.querySelector('[data-err]');
  if (e) { e.textContent = msg; e.hidden = false; }
}
function clearFieldError(field) {
  field.classList.remove('has-error');
  const e = field.querySelector('[data-err]');
  if (e) { e.hidden = true; }
}

// 4. Intro tipo de piel
function renderIntro() {
  return screen([
    el('p', { class: 'eyebrow', text: 'Primera parte' }),
    el('h2', { class: 'title', text: 'Test de tipo de piel' }),
    el('p', { class: 'body-text', text: 'Las pieles difieren entre sí y cada una tiene diferentes necesidades. Ringana ha creado y dividido sus productos pensando precisamente en cuidar de forma adecuada cada tipo de piel.' }),
    el('p', { class: 'body-text', text: 'Responde las siguientes preguntas para que sepamos qué necesita tu piel.' }),
    el('div', { class: 'actions' }, [primaryButton('Siguiente', next)]),
  ]);
}

// 5. Preguntas puntuadas P1–P15 (opción única)
function renderScored(qq) {
  const saved = state.scored[qq.id];
  const optsWrap = el('div', { class: 'options' });
  const errEl = el('p', { class: 'error-msg' }); errEl.hidden = true;

  qq.options.forEach((opt, i) => {
    const card = optionCard(LETTERS[i], opt.t, saved && saved.label === opt.t, false, () => {
      state.scored[qq.id] = { label: opt.t, points: opt.p };
      // Marca visualmente
      optsWrap.querySelectorAll('.option').forEach((n) => n.classList.remove('is-selected'));
      card.classList.add('is-selected');
      errEl.hidden = true;
    });
    optsWrap.appendChild(card);
  });

  return screen([
    el('p', { class: 'eyebrow', text: `Pregunta ${qq.id.slice(1)} de 15` }),
    el('h2', { class: 'question', text: qq.q }),
    optsWrap,
    errEl,
    el('div', { class: 'actions' }, [primaryButton('Siguiente', () => {
      if (!state.scored[qq.id]) { errEl.textContent = 'Elige una opción para continuar.'; errEl.hidden = false; return; }
      next();
    })]),
  ]);
}

function optionCard(letter, text, selected, multi, onClick) {
  return el('button', {
    class: 'option' + (multi ? ' option--multi' : '') + (selected ? ' is-selected' : ''),
    attrs: { type: 'button' },
    on: { click: onClick },
  }, [
    el('span', { class: 'option__letter', text: letter }),
    el('span', { class: 'option__text', text }),
  ]);
}

// 6. Abiertas informativas P16, P17
function renderInformativas() {
  const p16 = textareaField('¿Tienes algún diagnóstico de alguna enfermedad? (general o de la piel)', 'p16', state.abiertas.p16, true);
  const p17 = textareaField('¿Tu piel tiene alguna característica especial que debamos tener en cuenta? (lunares, manchas, arrugas, lentigos...)', 'p17', state.abiertas.p17, true);

  return screen([
    el('p', { class: 'eyebrow', text: 'Un par de cosas más' }),
    el('h2', { class: 'title', text: 'Cuéntame un poco más' }),
    el('p', { class: 'subtitle', text: 'Estas preguntas no puntúan. Son solo para conocerte mejor.' }),
    p16.field, p17.field,
    el('div', { class: 'actions' }, [primaryButton('Conoce tu resultado', () => {
      state.abiertas.p16 = p16.input.value.trim();
      state.abiertas.p17 = p17.input.value.trim();
      next();
    })]),
  ]);
}

// 7. Cálculo + página de resultado
function calcularPuntuacion() {
  return SCORED.reduce((sum, qq) => sum + (state.scored[qq.id] ? state.scored[qq.id].points : 0), 0);
}
function calcularTipoPiel(puntos) {
  if (puntos <= 10) return 'Grasa';
  if (puntos <= 20) return 'Mixta';
  return 'Seca';
}

function renderResult() {
  const puntos = calcularPuntuacion();
  const tipo = calcularTipoPiel(puntos);
  const info = RESULTS[tipo];

  const parrafos = info.parrafos.map((p) => el('p', { class: 'body-text', text: p }));

  return screen([
    el('span', { class: 'result-badge', text: 'Tu resultado' }),
    el('h2', { class: 'title', text: `${info.emoji} ${info.titulo}` }),
    ...parrafos,
    el('p', { class: 'score', html: `Tu puntuación: <strong>${puntos}</strong>` }),
    el('div', { class: 'actions' }, [primaryButton('Conoce el último paso', next)]),
  ]);
}

// 8. Personalización opción única P20–P22
function renderPersoSingle(id) {
  const def = PERSO_SINGLE[id];
  const saved = state.perso[id]; // índice
  const optsWrap = el('div', { class: 'options' });
  const errEl = el('p', { class: 'error-msg' }); errEl.hidden = true;

  def.options.forEach((opt, i) => {
    const card = optionCard(LETTERS[i], opt.t, saved === i, false, () => {
      state.perso[id] = i;
      optsWrap.querySelectorAll('.option').forEach((n) => n.classList.remove('is-selected'));
      card.classList.add('is-selected');
      errEl.hidden = true;
    });
    optsWrap.appendChild(card);
  });

  return screen([
    el('p', { class: 'eyebrow', text: 'Segunda parte · Personalización' }),
    el('h2', { class: 'question', text: def.q }),
    optsWrap,
    errEl,
    el('div', { class: 'actions' }, [primaryButton('Siguiente', () => {
      if (state.perso[id] == null) { errEl.textContent = 'Elige una opción para continuar.'; errEl.hidden = false; return; }
      next();
    })]),
  ]);
}

// P23 — selección múltiple (al menos una)
function renderP23() {
  const optsWrap = el('div', { class: 'options' });
  const errEl = el('p', { class: 'error-msg' }); errEl.hidden = true;

  P23.options.forEach((opt, i) => {
    const selected = state.perso.p23.includes(i);
    const card = optionCard(LETTERS[i], opt.t, selected, true, () => {
      const arr = state.perso.p23;
      const pos = arr.indexOf(i);
      if (pos === -1) { arr.push(i); card.classList.add('is-selected'); }
      else { arr.splice(pos, 1); card.classList.remove('is-selected'); }
      errEl.hidden = true;
    });
    optsWrap.appendChild(card);
  });

  return screen([
    el('p', { class: 'eyebrow', text: 'Segunda parte · Personalización' }),
    el('h2', { class: 'question', text: P23.q }),
    el('p', { class: 'subtitle', text: P23.hint }),
    optsWrap,
    errEl,
    el('div', { class: 'actions' }, [primaryButton('Siguiente', () => {
      if (state.perso.p23.length === 0) { errEl.textContent = 'Elige al menos una opción.'; errEl.hidden = false; return; }
      next();
    })]),
  ]);
}

// 9. Abiertas finales P18, P19 + consentimiento RGPD + Enviar
function renderFinales() {
  const p18 = textareaField('¿Cuál dirías que es tu objetivo principal para tu piel? (responde sin miedo)', 'p18', state.abiertas.p18, true);
  const p19 = textareaField('¿Crees que podrías añadir algo más que pueda influir en tu piel?', 'p19', state.abiertas.p19, true);

  // Consentimiento RGPD (obligatorio)
  const consentInput = el('input', { attrs: { type: 'checkbox', id: 'consent' } });
  consentInput.checked = state.consent;
  const consentBox = el('label', { class: 'consent', attrs: { for: 'consent' } }, [
    consentInput,
    el('span', { html:
      'Acepto que mis datos se traten para recibir mi diagnóstico y una recomendación personalizada de productos, y para que Lorena Navarro pueda contactarme al respecto. ' +
      'Consulta la <a href="' + CONFIG.PRIVACY_URL + '" target="_blank" rel="noopener">política de privacidad</a>.' // // TODO revisar: enlace real de política de privacidad
    }),
  ]);
  const consentErr = el('p', { class: 'error-msg' }); consentErr.hidden = true;
  consentInput.addEventListener('change', () => {
    state.consent = consentInput.checked;
    if (consentInput.checked) { consentBox.classList.remove('has-error'); consentErr.hidden = true; }
  });

  const enviarBtn = primaryButton('Enviar', () => {
    state.abiertas.p18 = p18.input.value.trim();
    state.abiertas.p19 = p19.input.value.trim();

    if (!state.consent) {
      consentBox.classList.add('has-error');
      consentErr.textContent = 'Necesito tu consentimiento para continuar.';
      consentErr.hidden = false;
      return;
    }
    enviarRespuesta(enviarBtn);
  });

  return screen([
    el('p', { class: 'eyebrow', text: 'Último paso' }),
    el('h2', { class: 'title', text: 'Para terminar' }),
    el('p', { class: 'subtitle', text: 'Estas preguntas no puntúan. Me ayudan a afinar tu recomendación.' }),
    p18.field, p19.field,
    consentBox, consentErr,
    el('div', { class: 'actions' }, [enviarBtn]),
  ]);
}

// 10. Agradecimiento
function renderThanks() {
  return screen([
    el('p', { class: 'emoji-big center', text: '📩' }),
    el('h2', { class: 'title center', text: '¿Y ahora qué?' }),
    el('p', { class: 'body-text', text: '¡Gracias por realizar el test!' }),
    el('p', { class: 'body-text', text: 'Voy a analizar tus respuestas y en los próximos días me pondré en contacto contigo para compartirte tu recomendación personalizada con los productos de Ringana.' }),
    el('p', { class: 'body-text', text: 'La cosmética de Ringana es 100 % natural, libre de tóxicos y altamente efectiva.' }),
    el('p', { class: 'body-text', text: 'Además, por mi parte... siempre hay sorpresas ✨🎁' }),
    el('p', { class: 'body-text soft', text: 'Hablamos pronto ;)' }),
  ]);
}

/* ---------------------------------------------------------
   VALIDACIÓN
   --------------------------------------------------------- */
function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validarTelefono(v) {
  // Acepta prefijo + y espacios; requiere entre 9 y 15 dígitos.
  const digitos = (v.match(/\d/g) || []).length;
  return /^\+?[\d\s]+$/.test(v) && digitos >= 9 && digitos <= 15;
}

/* ---------------------------------------------------------
   RUTINA RECOMENDADA (a partir de P20–P23, sin duplicados)
   --------------------------------------------------------- */
function construirRutina() {
  const productos = [];
  const addProd = (arr) => arr.forEach((p) => { if (!productos.includes(p)) productos.push(p); });

  ['p20', 'p21', 'p22'].forEach((id) => {
    const idx = state.perso[id];
    if (idx != null) addProd(PERSO_SINGLE[id].options[idx].prod);
  });
  state.perso.p23.forEach((i) => addProd(P23.options[i].prod));

  return productos;
}

/* ---------------------------------------------------------
   CONSTRUIR OBJETO DE RESPUESTA (sección 12 del spec)
   --------------------------------------------------------- */
function construirRespuesta() {
  const puntuacion = calcularPuntuacion();
  const tipoPiel = calcularTipoPiel(puntuacion);

  const respuestasPuntuadas = {};
  SCORED.forEach((qq) => {
    respuestasPuntuadas[qq.id] = state.scored[qq.id] ? state.scored[qq.id].label : '';
  });

  const p23Labels = state.perso.p23.map((i) => P23.options[i].t);

  return {
    timestamp: new Date().toISOString(),
    contacto: {
      nombre: state.contacto.nombre,
      email: state.contacto.email,
      telefono: state.contacto.telefono,
    },
    puntuacion,
    tipoPiel,
    respuestasPuntuadas,
    abiertas: {
      p16_diagnostico: state.abiertas.p16,
      p17_caracteristicas: state.abiertas.p17,
      p18_objetivo: state.abiertas.p18,
      p19_adicional: state.abiertas.p19,
    },
    personalizacion: {
      p20_sensibilidad: state.perso.p20 != null ? PERSO_SINGLE.p20.options[state.perso.p20].t : '',
      p21_prioridad: state.perso.p21 != null ? PERSO_SINGLE.p21.options[state.perso.p21].t : '',
      p22_tolerancia_noche: state.perso.p22 != null ? PERSO_SINGLE.p22.options[state.perso.p22].t : '',
      p23_objetivos: p23Labels,
    },
    rutinaRecomendada: construirRutina(),
  };
}

/* ---------------------------------------------------------
   ENVÍO A GOOGLE SHEETS (vía Apps Script)
   - Content-Type "text/plain" para evitar el preflight CORS.
   - Si falla, guarda en localStorage para reintento, pero
     muestra igualmente la página de agradecimiento.
   --------------------------------------------------------- */
async function enviarRespuesta(btn) {
  const data = construirRespuesta();

  if (btn) { btn.disabled = true; }

  try {
    if (!CONFIG.SHEETS_WEBAPP_URL) {
      // Sin URL configurada: guardamos en local para no perder el lead.
      guardarPendiente(data);
      console.warn('[Premium Skin Test] CONFIG.SHEETS_WEBAPP_URL vacío: respuesta guardada solo en localStorage.');
    } else {
      const res = await fetch(CONFIG.SHEETS_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
    }
  } catch (err) {
    console.error('[Premium Skin Test] Error al enviar, guardo para reintento:', err);
    guardarPendiente(data);
  } finally {
    // Pase lo que pase, mostramos el agradecimiento.
    goTo(VIEWS.findIndex((v) => v.id === 'thanks'));
  }
}

/* ---------------------------------------------------------
   PERSISTENCIA / REINTENTO en localStorage
   --------------------------------------------------------- */
const STORAGE_KEY = 'premiumSkinTest_pendientes';

function guardarPendiente(data) {
  try {
    const pend = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    pend.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pend));
  } catch (e) {
    console.error('[Premium Skin Test] No se pudo guardar en localStorage:', e);
  }
}

async function reintentarEnvioPendiente() {
  if (!CONFIG.SHEETS_WEBAPP_URL) return;
  let pend;
  try {
    pend = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) { return; }
  if (!pend.length) return;

  const quedan = [];
  for (const data of pend) {
    try {
      const res = await fetch(CONFIG.SHEETS_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (e) {
      quedan.push(data); // sigue pendiente
    }
  }
  try {
    if (quedan.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(quedan));
    else localStorage.removeItem(STORAGE_KEY);
  } catch (e) { /* noop */ }
}
