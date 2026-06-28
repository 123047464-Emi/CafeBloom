export const pedidosMock = [
  {
    id: 1,
    mesa: 4,
    estado: "Pendiente",
    hora: "12:30",
    tiempoEspera: "8 min",
    urgente: true,
    productos: [
      { nombre: "Hamburguesa", cantidad: 2 },
      { nombre: "Papas", cantidad: 1 },
    ],
  },
  {
    id: 2,
    mesa: 6,
    estado: "Preparando",
    hora: "12:35",
    tiempoEspera: "12 min",
    urgente: true,
    productos: [{ nombre: "Pizza", cantidad: 3 }],
  },
  {
    id: 3,
    mesa: 2,
    estado: "Listo",
    hora: "12:20",
    tiempoEspera: "15 min",
    urgente: false,
    productos: [{ nombre: "Café", cantidad: 1 }],
  },
  {
    id: 4,
    mesa: 8,
    estado: "Pendiente",
    hora: "12:45",
    tiempoEspera: "5 min",
    urgente: false,
    productos: [
      { nombre: "Ensalada", cantidad: 1 },
      { nombre: "Jugo", cantidad: 2 },
    ],
  },
];