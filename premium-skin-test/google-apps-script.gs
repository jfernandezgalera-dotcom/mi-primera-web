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

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
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
