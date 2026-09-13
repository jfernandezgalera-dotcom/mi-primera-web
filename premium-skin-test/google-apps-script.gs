/**
 * Premium Skin Test — Google Apps Script (backend sin servidor propio)
 *
 * Recibe por POST el JSON con la respuesta del test y lo añade como una
 * fila a la Google Sheet a la que esté vinculado este script.
 *
 * CÓMO USARLO
 *  1. Crea una Google Sheet nueva.
 *  2. Extensiones → Apps Script.
 *  3. Borra el contenido de Code.gs y pega TODO este archivo.
 *  4. Implementar → Nueva implementación → Tipo: Aplicación web.
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquiera
 *  5. Copia la URL "/exec" y pégala en CONFIG.SHEETS_WEBAPP_URL (app.js).
 *
 *  Al desplegar te pedirá autorizar los permisos: acéptalos.
 */

// ─────────────────────────────────────────────────────────────
// AVISO POR EMAIL
// Cada vez que se complete una respuesta, se envía un correo con
// toda la información a esta dirección. Déjalo vacío ('') si no
// quieres recibir emails.
var EMAIL_DESTINO = 'j.fernandezgalera@gmail.com'; // ← cámbiala si quieres otra
// ─────────────────────────────────────────────────────────────

// Cabeceras de la hoja, en el mismo orden que la fila de datos.
var HEADERS = [
  'timestamp', 'nombre', 'email', 'telefono', 'puntuacion', 'tipoPiel',
  'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10',
  'P11', 'P12', 'P13', 'P14', 'P15',
  'P16_diagnostico', 'P17_caracteristicas', 'P18_objetivo', 'P19_adicional',
  'P20_sensibilidad', 'P21_prioridad', 'P22_tolerancia_noche', 'P23_objetivos',
  'rutinaRecomendada'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Si la hoja está vacía, escribe primero la fila de cabeceras.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var rp = data.respuestasPuntuadas || {};
    var ab = data.abiertas || {};
    var per = data.personalizacion || {};

    var fila = [
      data.timestamp || new Date().toISOString(),
      (data.contacto && data.contacto.nombre) || '',
      (data.contacto && data.contacto.email) || '',
      (data.contacto && data.contacto.telefono) || '',
      (data.puntuacion != null ? data.puntuacion : ''),
      data.tipoPiel || '',
      // 15 respuestas puntuadas
      rp.p1 || '', rp.p2 || '', rp.p3 || '', rp.p4 || '', rp.p5 || '',
      rp.p6 || '', rp.p7 || '', rp.p8 || '', rp.p9 || '', rp.p10 || '',
      rp.p11 || '', rp.p12 || '', rp.p13 || '', rp.p14 || '', rp.p15 || '',
      // 4 abiertas
      ab.p16_diagnostico || '', ab.p17_caracteristicas || '',
      ab.p18_objetivo || '', ab.p19_adicional || '',
      // 4 de personalización (P23 unida por comas)
      per.p20_sensibilidad || '', per.p21_prioridad || '',
      per.p22_tolerancia_noche || '',
      (per.p23_objetivos || []).join(', '),
      // rutina recomendada
      (data.rutinaRecomendada || []).join(', ')
    ];

    sheet.appendRow(fila);

    // Aviso por email (si falla, no rompe el guardado en la hoja).
    try {
      enviarEmailAviso(data);
    } catch (mailErr) {
      // Solo lo registramos; la respuesta ya está guardada.
      console.error('Error al enviar el email de aviso: ' + mailErr);
    }

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

/**
 * Envía un email con toda la información de la respuesta.
 */
function enviarEmailAviso(data) {
  if (!EMAIL_DESTINO) return; // sin destinatario, no se envía

  var c = data.contacto || {};
  var rp = data.respuestasPuntuadas || {};
  var ab = data.abiertas || {};
  var per = data.personalizacion || {};

  var nombre = c.nombre || '(sin nombre)';
  var asunto = 'Nuevo Premium Skin Test — ' + nombre + ' · Piel ' + (data.tipoPiel || '?');

  // Etiquetas legibles de cada pregunta puntuada.
  var PREG = {
    p1: 'P1 · Rango de edad', p2: 'P2 · Solárium / sol', p3: 'P3 · Sitios cerrados',
    p4: 'P4 · Sensación crema', p5: 'P5 · Alcohol', p6: 'P6 · Impurezas',
    p7: 'P7 · Arrugas', p8: 'P8 · Ciudad', p9: 'P9 · Deporte',
    p10: 'P10 · Peso', p11: 'P11 · Climatización', p12: 'P12 · Alimentación',
    p13: 'P13 · Fuma', p14: 'P14 · Poros', p15: 'P15 · Enrojecimiento'
  };

  var lineas = [];
  lineas.push('Nueva respuesta del Premium Skin Test.');
  lineas.push('');
  lineas.push('CONTACTO');
  lineas.push('  Nombre:   ' + (c.nombre || ''));
  lineas.push('  Email:    ' + (c.email || ''));
  lineas.push('  Teléfono: ' + (c.telefono || ''));
  lineas.push('  Fecha:    ' + (data.timestamp || ''));
  lineas.push('');
  lineas.push('RESULTADO');
  lineas.push('  Puntuación: ' + (data.puntuacion != null ? data.puntuacion : ''));
  lineas.push('  Tipo de piel: ' + (data.tipoPiel || ''));
  lineas.push('');
  lineas.push('RUTINA RECOMENDADA');
  lineas.push('  ' + ((data.rutinaRecomendada || []).join(', ') || '(ninguna)'));
  lineas.push('');
  lineas.push('PERSONALIZACIÓN (P20–P23)');
  lineas.push('  P20 · Sensibilidad:        ' + (per.p20_sensibilidad || ''));
  lineas.push('  P21 · Prioridad:           ' + (per.p21_prioridad || ''));
  lineas.push('  P22 · Tolerancia noche:    ' + (per.p22_tolerancia_noche || ''));
  lineas.push('  P23 · Objetivos:           ' + ((per.p23_objetivos || []).join(', ')));
  lineas.push('');
  lineas.push('RESPUESTAS PUNTUADAS (P1–P15)');
  ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15'].forEach(function (k) {
    lineas.push('  ' + PREG[k] + ': ' + (rp[k] || ''));
  });
  lineas.push('');
  lineas.push('PREGUNTAS ABIERTAS');
  lineas.push('  P16 · Diagnóstico:      ' + (ab.p16_diagnostico || '(vacío)'));
  lineas.push('  P17 · Características:   ' + (ab.p17_caracteristicas || '(vacío)'));
  lineas.push('  P18 · Objetivo:         ' + (ab.p18_objetivo || '(vacío)'));
  lineas.push('  P19 · Algo más:         ' + (ab.p19_adicional || '(vacío)'));

  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: asunto,
    body: lineas.join('\n'),
    replyTo: c.email || undefined  // responder va directo al lead
  });
}

// Respuesta opcional para peticiones GET (comprobar que está desplegado).
function doGet() {
  return jsonOutput({ ok: true, msg: 'Premium Skin Test endpoint activo.' });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
