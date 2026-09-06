# El Mapa de tu Resistencia

Test de diagnóstico de una sola página. HTML + CSS + JS vanilla, sin
dependencias ni proceso de build (solo una fuente de Google Fonts).

## Cómo probarlo en local

Abre `index.html` directamente en el navegador (doble clic, o
"Abrir con..."). No hace falta servidor ni instalación.

Para comprobar la lógica de puntuación (los 9 perfiles y los casos de
empate), abre:

```
index.html?debug=1
```

Verás un panel con los tests unitarios de `resolveZona` / `resolveInstinto`
y la comprobación de que existen los 9 perfiles. Debe terminar en
`0 FALLOS`.

## Dónde pegar tu URL del endpoint

Abre `index.html`, busca cerca del principio del `<script>` la constante:

```js
const ENDPOINT = 'PEGA_AQUI_TU_URL_DE_ENDPOINT';
```

Sustituye ese valor por la URL de tu Google Apps Script (o el endpoint que
uses para recoger los datos), publicada como aplicación web que acepte
peticiones `POST`.

El test envía este objeto por `fetch` (con `Content-Type: text/plain` para
evitar el preflight de CORS, que Apps Script no maneja bien):

```
{ nombre, email, eso, tiempo, frase, ultima, sentido, dolor,
  forma, zona, instinto, perfil, zA, zB, zC, iA, iB, iC }
```

Si el envío falla, el resultado se muestra igualmente (nunca depende de la
red para eso), los datos se guardan en `localStorage` y se reintenta el
envío una vez en segundo plano.

## Qué archivos subo a Netlify

Solo hace falta:

- `index.html`

Arrástralo (o arrastra la carpeta entera) a Netlify y ya está desplegado.
No hay ningún paso de build.

## Otros archivos de este repositorio

- `landing-transformateca.html`: la landing anterior de Juan Fernández /
  La Transformateca, que ocupaba `index.html` antes de este cambio. Se
  conserva por si quieres recuperarla o enlazarla desde algún sitio, pero
  no se sube a Netlify a menos que la quieras publicar aparte.
