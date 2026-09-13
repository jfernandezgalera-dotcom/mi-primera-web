# Premium Skin Test

Quiz de diagnóstico de piel para captación de leads, de **Lorena Navarro**
(cosmética natural **Ringana**).

Web autónoma en **HTML + CSS + JavaScript vanilla**. Sin frameworks, sin
build, sin dependencias npm. Solo usa Google Fonts por CDN.

Al terminar, el test:

- calcula el **tipo de piel** (Grasa / Mixta / Seca) según la puntuación de P1–P15,
- muestra la página de resultado con su texto y la línea `Tu puntuación: {puntos}`,
- construye la **rutina recomendada** de productos Ringana a partir de P20–P23,
- y **guarda todas las respuestas en una Google Sheet** (sin backend propio).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura de la página (barra de progreso, contenedor, botón Atrás). |
| `styles.css` | Estética cosmética: serif en títulos, pastilla negra, mobile-first. |
| `app.js` | Toda la lógica: pantallas, validación, puntuación, rutina y envío. |
| `google-apps-script.gs` | Código para pegar en Apps Script (guardado en la hoja). |

---

## 1. Probar en local

No hace falta servidor ni instalación. Abre `index.html` en el navegador
(doble clic).

> Para probar el envío real a Google Sheets desde local necesitas primero
> configurar el Apps Script (pasos 2–4). Mientras `CONFIG.SHEETS_WEBAPP_URL`
> esté vacío, el test funciona igual y guarda cada respuesta en
> `localStorage` (no se pierde ningún lead).

---

## 2. Crear la Google Sheet

1. Ve a [sheets.new](https://sheets.new) y crea una hoja nueva.
2. Ponle el nombre que quieras (p. ej. *Premium Skin Test — Leads*).
3. No hace falta crear cabeceras a mano: el script las escribe solo la
   primera vez que llega una respuesta.

---

## 3. Pegar y desplegar el Apps Script

1. En la Google Sheet: **Extensiones → Apps Script**.
2. Borra lo que haya en `Code.gs` y **pega el contenido de
   `google-apps-script.gs`**.
3. Guarda (💾).
4. **Implementar → Nueva implementación**.
5. Icono del engranaje → tipo **Aplicación web**.
6. Configura:
   - **Ejecutar como:** Yo (tu cuenta).
   - **Quién tiene acceso:** **Cualquiera**.
7. **Implementar**. La primera vez te pedirá **autorizar permisos**: acepta
   (puede aparecer un aviso de "app no verificada" → *Configuración avanzada
   → Ir a (nombre del proyecto)*).
8. Copia la **URL de la aplicación web** (termina en `/exec`).

> Truco: abre esa URL `/exec` en el navegador. Debe responder
> `{"ok":true,"msg":"Premium Skin Test endpoint activo."}`.

---

## 4. Pegar la URL en la web

Abre `app.js` y pega la URL en la constante `CONFIG.SHEETS_WEBAPP_URL`
(arriba del todo):

```js
const CONFIG = {
  SHEETS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfy...xxxx/exec',
  ...
};
```

Guarda. Ya está: al enviar el test, cada respuesta aparece como una fila
nueva en la hoja.

> **Sin preflight CORS:** el envío se hace con `Content-Type: text/plain`
> aunque el cuerpo sea JSON. Es a propósito, para que Apps Script no rechace
> la petición.

---

## 5. Desplegar / embeber la web

Es un sitio estático. Cualquiera de estas opciones vale:

- **Netlify:** arrastra la carpeta `premium-skin-test/` a
  [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** `vercel` desde la carpeta, o importa el repo y marca esta
  carpeta como *root*.
- **GitHub Pages:** sube los archivos a un repo y activa Pages sobre la rama
  (si publicas todo el repo, la web queda en `/premium-skin-test/`).

Para **embeber** en otra página (web de Lorena, Notion, etc.), usa un
iframe apuntando a la URL desplegada:

```html
<iframe src="https://TU-URL/index.html" width="100%" height="800"
        style="border:0;" title="Premium Skin Test"></iframe>
```

---

## Notas

- **RGPD:** antes del botón *Enviar* hay una casilla de consentimiento
  obligatoria con enlace a la política de privacidad. Ese enlace es un
  **placeholder** (`CONFIG.PRIVACY_URL`) → cámbialo por el real.
- **Textos (BORRADOR):** los textos de resultado de *Piel Grasa* y *Piel
  Seca* están marcados como borrador en el spec. En el código llevan un
  comentario `// TODO revisar`. El de *Piel Mixta* es el texto original.
- **Datos guardados** (columnas de la hoja, en orden): timestamp, nombre,
  email, teléfono, puntuación, tipoPiel, P1–P15, P16–P19 (abiertas),
  P20–P23 (personalización; P23 unida por comas) y rutinaRecomendada.
- **Puntuación:** 0–10 → Grasa · 11–20 → Mixta · 21–30 → Seca. Máximo 30.
