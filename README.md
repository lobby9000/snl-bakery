# SNL's Bakery · página del catálogo

**En línea:** https://lobby9000.github.io/snl-bakery/

Página estática con el catálogo navideño de Sundae, Nimue & Lana's Bakery. Muestra la sala con el árbol en 3D (cada esfera es una galleta), el catálogo completo y un carrito que arma el pedido y lo abre en WhatsApp. No cobra en línea: los pagos siguen siendo en efectivo o por transferencia.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página. Casi nunca hay que tocarla. |
| `catalogo.js` | **Lo que sí se edita**: productos, precios, fotos, fechas de la temporada, formas de pago, entregas, WhatsApp y los colores de los gatos. |
| `css/estilos.css` | Colores, tipografías y acomodo. |
| `js/sitio.js` | Catálogo, carrito y mensaje de WhatsApp. |
| `js/escena.js` | La sala en 3D (árbol, focos, tren, chimenea, ventana y gatos). |
| `vendor/three.module.min.js` | three.js 0.170.0, la librería del 3D (licencia MIT en `vendor/THREE-LICENSE.txt`). |
| `img/` | Aquí van las fotos o carteles de cada galleta y el ícono de la pestaña. |

## Cambiar precios, textos o fotos

Todo vive en `catalogo.js`. Cada producto tiene `precio`, `piezas`, `descripcion` y `color` (el color de su esfera en el árbol).

Para poner la foto o el cartel de una galleta:

1. Expórtalo en vertical 4:5, por ejemplo 1080 × 1350 px, en `.jpg` o `.webp` y de menos de 300 KB.
2. Guárdalo en `img/` con un nombre sin espacios ni acentos, como `img/jengibre-royal.jpg`.
3. En `catalogo.js`, escribe la ruta en el campo `imagen` de ese producto: `imagen: "img/jengibre-royal.jpg"`.

Mientras `imagen` esté vacío, la página dibuja una etiqueta provisional con el color de la galleta.

Un producto con `porPedido: true` aparece en el catálogo con la insignia "Por pedido" y una esfera más chica en el árbol. Así están las de chispas y las snickerdoodle.

Los gatos usan los colores de `negocio.gatos`. Si cambias `pelaje`, `panza`, `rayas` u `ojos`, cambian en el 3D y en el cuadrito sobre la chimenea.

La workstation también lo genera con los precios que tengan ahí. En la pestaña **Costos y precios**, el botón *Copiar catálogo para la página* copia el archivo completo. Luego, en GitHub, abre `catalogo.js`, toca el lápiz para editarlo, borra todo, pega y guarda con *Commit changes*. Si el copiado no funciona en tu teléfono, usa *Descargar como texto* y pega ese contenido.

## Publicarla en GitHub Pages

1. En GitHub, crea un repositorio público, por ejemplo `snl-bakery`.
2. Sube todo el contenido de esta carpeta a la raíz del repositorio, con las carpetas `css`, `js`, `vendor` e `img` tal cual.
3. Entra a **Settings → Pages**. En *Build and deployment* elige *Deploy from a branch*, la rama `main` y la carpeta `/ (root)`. Guarda.
4. En uno o dos minutos la página queda en `https://lobby9000.github.io/snl-bakery/`.

Cada vez que subas un cambio a `main`, la página se actualiza sola. Si después compran un dominio propio, se configura en esa misma pantalla.

## Probarla en la compu

Por seguridad, el navegador no carga el 3D si abres `index.html` con doble clic. Abre una terminal en esta carpeta y corre:

```
python3 -m http.server 8000
```

Luego entra a `http://localhost:8000`.

## Detalles que ya resuelve

- En celular la escena se reacomoda en vertical y las tarjetas del catálogo se vuelven compactas.
- Si el teléfono no tiene 3D, la página se ve completa sin la escena. Si la persona pidió reducir animaciones en su sistema, la sala se queda quieta.
- La animación se pausa cuando la escena no está en pantalla, para no gastar batería.
- El carrito se guarda en el navegador de quien visita, así que no se pierde si recarga la página.
- No usa cookies, rastreadores ni servidores propios. Las tipografías vienen de Google Fonts.
