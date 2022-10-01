const treeLocations = [
  {
    id: 1,
    name: 'Tortillería La Salle',
    area: [
      {
        id: 1,
        name: 'despacho',
        workspace: [
          {
            id: 1,
            name: 'caja',
            system: [
              {
                id: 1,
                name: 'cuaderno',
              },
              {
                id: 2,
                name: 'caja registradora',
              },
            ],
          },
          {
            id: 2,
            name: 'entrega',
            system: [
              {
                id: 1,
                name: 'pila de tortillas',
              },
              {
                id: 2,
                name: 'cuaderno repartidores',
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'cocina',
        workspace: [
          {
            id: 1,
            name: 'mesa',
            system: [
              {
                id: 1,
                name: 'grapadora',
              },
              {
                id: 2,
                name: 'silla',
              },
            ],
          },
          {
            id: 2,
            name: 'reposadores',
            system: [
              {
                id: 1,
                name: 'carrito',
              },
              {
                id: 2,
                name: 'mesa',
              },
            ],
          },
        ],
      },
    ],
  },
];

export default treeLocations;
