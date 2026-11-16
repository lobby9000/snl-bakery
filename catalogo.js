/*
  Catálogo de SNL's Bakery.
  Aquí se cambian precios, textos, fotos y datos de contacto. La página se arma sola con esto.
  La workstation puede volver a generar este archivo con los precios que tengan ahí.

  imagen: ruta de la foto o poster (por ejemplo "img/jengibre-royal.jpg"). Si se deja vacía,
          la página dibuja una etiqueta provisional con el color de la galleta.
  color:  color de la esfera de esa galleta en el árbol y de su etiqueta.
  porPedido: true = se muestra en el catálogo pero no entra en el plan de producción.
*/
window.SNL = {
  negocio: {
    nombre: "SNL's Bakery",
    nombreLargo: "Sundae, Nimue & Lana's Bakery",
    lema: "Galletas navideñas hechas en casa",
    sublema: "Horneadas por pedido en la CDMX y aprobadas por Sundae, Nimue y Lana.",
    whatsapp: "525565393328",
    whatsappVisible: "55 6539 3328",
    instagram: "sl.bakery_mx",
    pagos: ["Efectivo", "Transferencia"],
    anticipo: "Para apartar, 50% por transferencia y el resto al entregar.",
    entregas: [
      "Entrega personal en estaciones del metro de la CDMX",
      "Envío por Uber, con costo extra según la distancia"
    ],
    temporada: {
      abre: "2026-11-20",
      ultimoPedido: "2026-12-17",
      ultimasEntregas: "2026-12-23",
      corteSemanal: "miércoles",
      diaEntrega: "sábado"
    },
    gatos: [
      { nombre: "Sundae", pose: "echada", pelaje: "#8a7560", panza: "#f3ebdf", rayas: "#4b3a2c", ojos: "#c9a43b" },
      { nombre: "Lana", pose: "jugando", pelaje: "#d47f2c", panza: "#fbf2e4", rayas: "#a65a1b", ojos: "#86a83c" },
      { nombre: "Nimue", pose: "dormida", pelaje: "#38363a", panza: "#d9d2c8", rayas: null, ojos: "#d6b13a" }
    ]
  },

  productos: [
    {
      id: "jengibre-royal",
      nombre: "Muñecos de jengibre con royal icing",
      corto: "Jengibre artesanal",
      piezas: 12,
      precio: 160,
      etiqueta: "Artesanal",
      color: "#c62828",
      icono: "hombre",
      descripcion: "Galleta suave de jengibre con canela, clavo, nuez moscada, miel y azúcar mascabado, decorada a mano con royal icing de claras de huevo.",
      cuidados: "Sin conservadores: disfrútalas en los primeros días o guárdalas en el refri.",
      imagen: ""
    },
    {
      id: "jengibre-clasica",
      nombre: "Muñecos de jengibre con glaseado sencillo",
      corto: "Jengibre clásica",
      piezas: 12,
      precio: 130,
      color: "#e0a526",
      icono: "hombre",
      descripcion: "La misma galleta de jengibre, decorada con un glaseado sencillo que aguanta más días.",
      imagen: ""
    },
    {
      id: "kit-jengibre",
      nombre: "Kit para decorar en casa",
      corto: "Kit para decorar",
      piezas: 12,
      precio: 180,
      etiqueta: "Nuevo",
      color: "#2f6fd6",
      icono: "kit",
      descripcion: "12 muñecos de jengibre sin decorar, tubo de glaseado y chispitas de colores para decorarlos en familia.",
      imagen: ""
    },
    {
      id: "mantequilla",
      nombre: "Galletas de mantequilla",
      corto: "Mantequilla",
      piezas: 20,
      precio: 170,
      color: "#f2e4c4",
      icono: "redonda",
      descripcion: "Galleta danesa suave hecha con mantequilla de verdad, terminada con chocolate semiamargo o un toque de azúcar glas.",
      imagen: ""
    },
    {
      id: "linzer",
      nombre: "Linzer",
      corto: "Linzer",
      piezas: 10,
      precio: 150,
      color: "#d81b60",
      icono: "linzer",
      descripcion: "Galleta de mantequilla y almendra rellena de mermelada, espolvoreada con azúcar glas.",
      alergenos: "Contiene almendra.",
      imagen: ""
    },
    {
      id: "surtida",
      nombre: "Caja surtida navideña",
      corto: "Caja surtida",
      piezas: 18,
      precio: 220,
      etiqueta: "Para regalar",
      color: "#2e7d32",
      icono: "caja",
      descripcion: "6 muñecos de jengibre, 6 de mantequilla y 6 linzer en una caja lista para regalar.",
      alergenos: "Contiene almendra.",
      imagen: ""
    },
    {
      id: "chispas",
      nombre: "Chispas de chocolate",
      corto: "Chispas",
      piezas: 10,
      precio: 165,
      porPedido: true,
      color: "#7b4a2a",
      icono: "chispas",
      descripcion: "Crujiente por fuera y suave por dentro, con mantequilla dorada, chocolate semiamargo y de leche y un toque de sal kosher.",
      imagen: ""
    },
    {
      id: "snickerdoodle",
      nombre: "Snickerdoodle",
      corto: "Snickerdoodle",
      piezas: 6,
      precio: 69,
      porPedido: true,
      color: "#c98b3e",
      icono: "redonda",
      descripcion: "Galleta de canela y azúcar con mantequilla de verdad y cremor tártaro: crujiente por fuera, suave por dentro.",
      imagen: ""
    }
  ]
};
