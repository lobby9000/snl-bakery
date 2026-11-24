/*
  Catálogo de SNL's Bakery.
  Aquí se cambian precios, textos, fotos y datos de contacto. La página se arma sola con esto.
  Generado desde la workstation el martes, 24 de noviembre.

  imagen:     ruta de la foto o poster (por ejemplo "img/jengibre-royal.jpg"). Si se deja vacía,
              la página dibuja una etiqueta provisional con el color de la galleta.
  color:      color de la esfera de esa galleta en el árbol y de su etiqueta.
  precio:     precio en bolsa. caja: lo que suma si la quieren en caja de regalo.
  opciones:   lo que elige el cliente (masa, relleno, sabor) y cuánto suma cada opción.
  pieza:      precio por galleta dentro de la caja surtida. arma: mínimo, máximo y la caja de muestra.
  lab:        sale en la sección Santa Lab.
  calendario: días para hornear, días llenos, días sin entregas y excepciones.
*/
window.SNL = {
  "negocio": {
    "nombre": "SNL's Bakery",
    "nombreLargo": "Sundae, Nimue & Lana's Bakery",
    "lema": "Galletas navideñas hechas en casa",
    "sublema": "Horneadas por pedido en la CDMX y aprobadas por Sundae, Nimue y Lana.",
    "firma": "Las favoritas de Santa",
    "whatsapp": "525565393328",
    "whatsappVisible": "55 6539 3328",
    "instagram": "sl.bakery_mx",
    "pagos": [
      "Efectivo",
      "Transferencia"
    ],
    "anticipo": "Para apartar tu fecha pagas por adelantado al menos el 70% (o todo, si prefieres). El resto, al entregar.",
    "entregas": [
      "Entrega personal en estaciones del metro de la CDMX",
      "Envío por Uber, con costo extra según la distancia"
    ],
    "temporada": {
      "abre": "2026-11-20",
      "ultimoPedido": "2026-12-21",
      "ultimasEntregas": "2026-12-23"
    },
    "gatos": [
      {
        "nombre": "Sundae",
        "pose": "echada",
        "escala": 1.2,
        "patron": "bicolor",
        "pelaje": "#d9822b",
        "panza": "#fbf4ea",
        "rayas": "#b5611c",
        "ojos": "#b9c46a",
        "orejas": "#d9822b"
      },
      {
        "nombre": "Nimue",
        "pose": "jugando",
        "escala": 0.74,
        "patron": "punto",
        "pelaje": "#efe6d8",
        "panza": "#f8f2e9",
        "puntos": "#8c7d72",
        "rayas": "#5f544d",
        "ojos": "#86b8e8",
        "orejas": "#6a5d55"
      },
      {
        "nombre": "Lana",
        "pose": "camaron",
        "escala": 1,
        "patron": "calico",
        "pelaje": "#f7f0e4",
        "panza": "#fbf6ee",
        "manchas": [
          "#d4843c",
          "#6b625b"
        ],
        "rayas": "#3a3431",
        "ojos": "#c4b64a",
        "orejas": "#6b625b"
      }
    ],
    "calendario": {
      "minDias": 3,
      "hasta": "2027-01-06",
      "llenos": [
        "2026-12-19"
      ],
      "sinEntrega": [
        "2026-12-24",
        "2026-12-25",
        "2026-12-31"
      ],
      "sinPedidos": [
        "2026-12-24"
      ],
      "excepciones": [
        {
          "entrega": "2026-12-23",
          "ultimoPedido": "2026-12-21"
        }
      ]
    },
    "anticipoMin": 70
  },
  "productos": [
    {
      "id": "jengibre-royal",
      "nombre": "Muñecos de jengibre con royal icing",
      "corto": "Jengibre artesanal",
      "piezas": 12,
      "precio": 180,
      "etiqueta": "Artesanal",
      "color": "#c62828",
      "icono": "hombre",
      "descripcion": "Galleta suave de jengibre con canela, clavo, nuez moscada, miel y azúcar mascabado, decorada a mano con royal icing.",
      "cuidados": "Sin conservadores: guárdalas en un lugar fresco y seco y disfrútalas en los primeros días.",
      "imagen": "",
      "caja": 20,
      "pieza": 13
    },
    {
      "id": "jengibre-clasica",
      "nombre": "Muñecos de jengibre con glaseado sencillo",
      "corto": "Jengibre clásica",
      "piezas": 12,
      "precio": 130,
      "color": "#e0a526",
      "icono": "hombre",
      "descripcion": "La misma galleta de jengibre, decorada con un glaseado sencillo que aguanta más días.",
      "imagen": "",
      "caja": 20
    },
    {
      "id": "kit-jengibre",
      "nombre": "Kit para decorar en casa",
      "corto": "Kit para decorar",
      "piezas": 12,
      "precio": 250,
      "etiqueta": "Nuevo",
      "color": "#2f6fd6",
      "icono": "kit",
      "descripcion": "12 muñecos de jengibre sin decorar, tubo de glaseado y chispitas de colores para decorarlos en familia.",
      "imagen": "",
      "caja": 20
    },
    {
      "id": "mantequilla",
      "nombre": "Galletas de mantequilla",
      "corto": "Mantequilla",
      "piezas": 20,
      "precio": 170,
      "color": "#f2e4c4",
      "icono": "redonda",
      "descripcion": "Galleta danesa suave hecha con mantequilla de verdad, terminada con chocolate semiamargo o un toque de azúcar glas.",
      "imagen": "",
      "caja": 20,
      "pieza": 13
    },
    {
      "id": "linzer",
      "nombre": "Linzer",
      "corto": "Linzer",
      "piezas": 10,
      "precio": 180,
      "color": "#d81b60",
      "icono": "linzer",
      "descripcion": "Galleta de mantequilla y almendra rellena de mermelada, espolvoreada con azúcar glas.",
      "alergenos": "Contiene almendra.",
      "imagen": "",
      "caja": 20,
      "pieza": 17
    },
    {
      "id": "surtida",
      "nombre": "Caja surtida navideña: ármala tú",
      "corto": "Caja surtida",
      "precio": 258,
      "etiqueta": "Para regalar",
      "color": "#2e7d32",
      "icono": "caja",
      "descripcion": "Elige de 12 a 24 galletas y combínalas como quieras. Va en caja de regalo con papel, estambre y sticker.",
      "alergenos": "Contiene almendra.",
      "imagen": "",
      "arma": {
        "min": 12,
        "max": 24,
        "inicial": {
          "jengibre-royal": 6,
          "mantequilla": 6,
          "linzer": 6
        }
      }
    },
    {
      "id": "chispas",
      "nombre": "Chispas de chocolate",
      "corto": "Chispas",
      "piezas": 10,
      "precio": 165,
      "color": "#7b4a2a",
      "icono": "chispas",
      "descripcion": "Crujiente por fuera y suave por dentro, con mantequilla dorada, chocolate semiamargo y de leche y un toque de sal kosher.",
      "imagen": "",
      "caja": 20
    },
    {
      "id": "snickerdoodle",
      "nombre": "Snickerdoodle",
      "corto": "Snickerdoodle",
      "piezas": 6,
      "precio": 69,
      "color": "#c98b3e",
      "icono": "redonda",
      "descripcion": "Galleta de canela y azúcar con mantequilla de verdad y cremor tártaro: crujiente por fuera, suave por dentro. También de rompope, sin alcohol.",
      "imagen": "",
      "opciones": [
        {
          "id": "sabor",
          "nombre": "Sabor",
          "defecto": "original",
          "valores": [
            {
              "id": "original",
              "nombre": "Original de canela",
              "extra": 0
            },
            {
              "id": "rompope",
              "nombre": "De rompope (sin alcohol)",
              "extra": 6
            }
          ]
        }
      ],
      "caja": 20,
      "pieza": 16
    },
    {
      "id": "grinch",
      "nombre": "Grinch crinkle",
      "corto": "Grinch",
      "piezas": 6,
      "precio": 75,
      "color": "#4caf50",
      "icono": "redonda",
      "descripcion": "Nuestra crinkle verde de siempre: suave por dentro, cuarteada por fuera y revolcada en azúcar glass.",
      "imagen": "",
      "caja": 20,
      "pieza": 14
    },
    {
      "id": "thumbprint",
      "nombre": "Thumbprint navideñas",
      "corto": "Thumbprint",
      "piezas": 12,
      "precio": 150,
      "etiqueta": "Santa Lab",
      "lab": true,
      "color": "#e8c547",
      "icono": "thumb",
      "descripcion": "Galletita de mantequilla con el centro relleno. Rompope y eggnog son caseros y sin alcohol.",
      "cuidados": "Los rellenos de crema van al refri: disfrútalas en 3 días.",
      "imagen": "",
      "opciones": [
        {
          "id": "base",
          "nombre": "Masa",
          "defecto": "sencilla",
          "valores": [
            {
              "id": "sencilla",
              "nombre": "Sencilla de mantequilla",
              "extra": 0
            },
            {
              "id": "chocolate",
              "nombre": "De chocolate",
              "extra": 25
            }
          ]
        },
        {
          "id": "relleno",
          "nombre": "Relleno",
          "defecto": "rompope",
          "valores": [
            {
              "id": "rompope",
              "nombre": "Rompope",
              "extra": 0
            },
            {
              "id": "eggnog",
              "nombre": "Eggnog",
              "extra": 0
            },
            {
              "id": "arroz",
              "nombre": "Arroz con leche",
              "extra": 0
            },
            {
              "id": "chocolate",
              "nombre": "Chocolate",
              "extra": 25
            }
          ]
        }
      ],
      "caja": 20
    },
    {
      "id": "jalea-ponche",
      "nombre": "Galletas de jalea de ponche",
      "corto": "Jalea de ponche",
      "piezas": 10,
      "precio": 160,
      "etiqueta": "Santa Lab",
      "lab": true,
      "color": "#c2185b",
      "icono": "linzer",
      "descripcion": "Galleta de mantequilla con jalea casera de ponche: tejocote, guayaba, manzana, piloncillo y canela del mercado.",
      "imagen": "",
      "caja": 20
    },
    {
      "id": "teddy",
      "nombre": "Teddy navideñas",
      "corto": "Teddy",
      "piezas": 6,
      "precio": 135,
      "etiqueta": "Santa Lab",
      "lab": true,
      "color": "#8d5a3b",
      "icono": "oso",
      "descripcion": "Galleta de azúcar con chispas y chocolates de colores, con un osito Teddy Graham arriba decorado con royal icing.",
      "imagen": "",
      "caja": 20
    }
  ]
};
