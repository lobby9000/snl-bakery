# SNL's Bakery · página del catálogo

**En línea:** https://lobby9000.github.io/snl-bakery/

Página estática con el catálogo navideño de Sundae, Nimue & Lana's Bakery. Muestra la sala con el árbol en 3D (cada esfera es una galleta), el catálogo completo con Santa Lab, la caja surtida que arma el cliente, un calendario de entregas y un carrito que arma el pedido y lo abre en WhatsApp. No cobra en línea: los pagos siguen siendo en efectivo o por transferencia, con un anticipo mínimo de 70%.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página. Casi nunca hay que tocarla. |
| `catalogo.js` | **Lo que sí se edita**: productos, precios, opciones, fotos, calendario, anticipo, formas de pago, entregas, WhatsApp y los gatos. |
| `css/estilos.css` | Colores, tipografías y acomodo. |
| `js/sitio.js` | Catálogo, caja surtida, calendario, carrito y mensaje de WhatsApp. |
| `js/escena.js` | La sala en 3D (árbol, focos, tren, chimenea, ventana y gatos). |
| `vendor/three.module.min.js` | three.js 0.170.0, la librería del 3D (licencia MIT en `vendor/THREE-LICENSE.txt`). |
| `img/` | Aquí van las fotos o carteles de cada galleta y el ícono de la pestaña. |

## Cambiar precios, textos o fotos

Todo vive en `catalogo.js`. Cada producto tiene `precio` (en bolsa), `piezas`, `descripcion` y `color` (el color de su esfera en el árbol). Además:

- `caja`: lo que suma si la quieren en caja de regalo. Si no lo tiene, solo se vende en bolsa.
- `opciones`: lo que elige el cliente, como la masa o el relleno de las thumbprint, con lo que suma cada opción (`extra`).
- `lab: true`: sale en la sección Santa Lab y su esfera en el árbol es una gota con punta dorada.
- `pieza`: precio por galleta dentro de la caja surtida. La caja surtida tiene `arma` con el mínimo, el máximo y la caja de muestra.

En `negocio.calendario` están los días para hornear (`minDias`), el último día con entregas (`hasta`), los días llenos (`llenos`), los días sin entregas (`sinEntrega`), los días sin pedidos (`sinPedidos`) y las excepciones (por ejemplo, entregar el 23 con pedidos hasta el 21). `negocio.anticipoMin` es el porcentaje mínimo para apartar. El calendario usa la hora de la Ciudad de México.

Para poner la foto o el cartel de una galleta:

1. Expórtalo en vertical 4:5, por ejemplo 1080 × 1350 px, en `.jpg` o `.webp` y de menos de 300 KB.
2. Guárdalo en `img/` con un nombre sin espacios ni acentos, como `img/jengibre-royal.jpg`.
3. En `catalogo.js`, escribe la ruta en el campo `imagen` de ese producto: `imagen: "img/jengibre-royal.jpg"`.

Mientras `imagen` esté vacío, la página dibuja una etiqueta provisional con el color de la galleta.

Los gatos usan `negocio.gatos`: `pose` (echada, jugando o camaron), `escala`, `patron` (bicolor, punto o calico) y sus colores (`pelaje`, `panza`, `rayas`, `puntos`, `manchas`, `ojos`, `orejas`). Cambian en el 3D y en el cuadrito sobre la chimenea.

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
- El botón de WhatsApp no se activa hasta que eligen el día de entrega.
- No usa cookies, rastreadores ni servidores propios. Las tipografías vienen de Google Fonts.
