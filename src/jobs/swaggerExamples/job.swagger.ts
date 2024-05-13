export const exampleCreatedJob = {
  id: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
  name: 'Licuadora danada',
  description: 'Necesito reparar licuadora, no enciende directamente',
  base_price: 36.5,
  categoryId: 'cfc48688-57ca-43d2-9f1d-88c8a236aefe',
  userId: '18908870-475e-42e1-9620-588c38221377',
};

export const jobApiBody = {
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary' },
      name: { type: 'string', description: 'Nombre del trabajo' },
      description: {
        type: 'string',
        description: 'Breve descripcion del trabajo',
      },
      base_price: {
        type: 'number',
        description: 'Precio base de postulacion',
      },
      categoryId: {
        type: 'string',
        description: 'Categoria del trabajo',
      },
      userId: {
        type: 'string',
        description: 'ID de Usuario',
      },
    },
  },
};
