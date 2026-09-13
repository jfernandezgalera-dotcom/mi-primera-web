# Premium Skin Test

Quiz de diagnóstico de piel para captación de leads, de **Lorena Navarro**
(cosmética natural **Ringana**).

Web autónoma en **HTML + CSS + JavaScript vanilla**. Sin frameworks, sin
build, sin dependencias npm. Solo usa Google Fonts por CDN.

Al terminar, el test:

- calcula el **tipo de piel** (Grasa / Mixta / Seca) según la puntuación de P1–P15,
- muestra la página de resultado con su texto y la línea `Tu puntuación: {puntos}`,
- construye la **rutina recomendada** de productos Ringana a partir de P20–P23,
- **guarda todas las respuestas en una Google Sheet** (sin backend propio),
- y te **avisa por email** con toda la información en cada respuesta.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura de la página (barra de progreso, contenedor, botón Atrás). |
| `styles.css` | Estética cosmética: serif en títulos, pastilla negra, mobile-first. |
| `app.js` | Toda la lógica: pantallas, validación, puntuación, rutina y envío. |
| `google-apps-script.gs` | Código para pegar en Apps Script (guardado en la hoja + aviso por email). |

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

1. Con la Google Sheet abierta, arriba en el menú pulsa **Extensiones →
   Apps Script**. Se abre una pestaña nueva (el editor de Apps Script).
2. Verás un archivo `Code.gs` con unas líneas de ejemplo
   (`function myFunction() {}`). **Bórralo todo** (selecciona con
   `Ctrl/Cmd + A` y suprime).
3. Abre `google-apps-script.gs` de este proyecto, copia **todo** su
   contenido y **pégalo** en el editor.
4. *(Opcional, para el email)* en la línea `var EMAIL_DESTINO = '...'`
   pon el correo donde quieres recibir los avisos. Déjalo con `''` si no
   quieres emails. → Ver la **sección 5**.
5. Pulsa el icono de **guardar** (💾) o `Ctrl/Cmd + S`. Ponle nombre al
   proyecto si te lo pide (p. ej. *Premium Skin Test*).
6. Arriba a la derecha: botón azul **Implementar → Nueva implementación**.
7. Pulsa el **icono del engranaje** ⚙️ (junto a "Seleccionar tipo") y elige
   **Aplicación web**.
8. Rellena:
   - **Descripción:** lo que quieras (p. ej. `v1`).
   - **Ejecutar como:** **Yo** (tu cuenta de Google).
   - **Quién tiene acceso:** **Cualquiera**. ⚠️ Este paso es clave: si
     pones "Solo yo", la web no podrá guardar nada.
9. Pulsa **Implementar**.
10. **Autorizar permisos** (solo la primera vez):
    - Pulsa **Autorizar acceso** → elige tu cuenta de Google.
    - Si sale la pantalla *"Google no ha verificado esta aplicación"*: pulsa
      **Configuración avanzada** → **Ir a (nombre del proyecto) (no seguro)**
      → **Permitir**. Es tu propio script, es seguro.
    - Concede los permisos (acceso a tus hojas de cálculo y a enviar correo
      en tu nombre, si activaste el email).
11. Se muestra la **URL de la aplicación web**: es larga y **termina en
    `/exec`**. Cópiala con el botón **Copiar**.

> **Comprobar que funciona:** pega esa URL `/exec` en el navegador. Debe
> responder `{"ok":true,"msg":"Premium Skin Test endpoint activo."}`.

> **Si más adelante cambias el código `.gs`:** no basta con guardar.
> Ve a **Implementar → Gestionar implementaciones**, pulsa el **lápiz**
> (editar) de tu implementación, en *Versión* elige **Nueva versión** y
> **Implementar**. Así la URL sigue siendo la misma pero con el código
> nuevo. (Si creas una implementación *nueva* en vez de actualizar, la URL
> cambia y tendrías que volver a pegarla en `app.js`.)

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

## 5. Recibir un email con cada respuesta

El aviso por correo **ya está incluido** en `google-apps-script.gs`: no
necesitas nada más (usa `MailApp`, el servicio de correo que Google trae de
serie). Cada vez que alguien termina el test, te llega un email con toda la
información: contacto, puntuación, tipo de piel, rutina recomendada y todas
las respuestas.

**Cómo activarlo:**

1. En el editor de Apps Script, arriba del archivo busca esta línea:

   ```js
   var EMAIL_DESTINO = 'j.fernandezgalera@gmail.com'; // ← cámbiala si quieres otra
   ```

2. Pon entre las comillas el correo donde quieres recibir los avisos.
   Para desactivar los emails, déjalo vacío: `var EMAIL_DESTINO = '';`.

3. Guarda (💾) y **actualiza la implementación** (Implementar → Gestionar
   implementaciones → lápiz → Nueva versión → Implementar). Ver el aviso al
   final de la sección 3.

4. La **primera vez** que se ejecute el envío de correo, Google te pedirá
   un permiso extra (*"Enviar correo electrónico en tu nombre"*). Ya lo
   habrás aceptado al autorizar en la sección 3; si no, acéptalo.

**Detalles útiles:**

- El **asunto** del email es, por ejemplo:
  `Nuevo Premium Skin Test — Ana García · Piel Mixta`.
- El campo **responder a** (`reply-to`) apunta al email del lead, así que si
  le das a *Responder* escribes directamente a la persona.
- Si el envío del correo fallara por lo que sea, **la respuesta se guarda
  igual en la hoja** (el email nunca bloquea el guardado).
- **Límite de Google:** las cuentas Gmail gratuitas permiten enviar unos
  **100 correos/día** desde Apps Script (las de Workspace, 1.500). De sobra
  para captación de leads, pero tenlo en cuenta.
- ¿No te llega? Revisa la carpeta de **spam** la primera vez y marca el
  remitente como "no es spam".

---

## 6. Desplegar / embeber la web

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
