import { error } from 'console';

export const exampleCreatedService = {
  id: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
  name: 'Reparación de lamparas LED',
  description: 'Reparación de lamparas LED',
  categoryId: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
};

export const servicesValidationErrors = [
  {
    message: [
      'name must be a string',
      'name should not be empty',
      'name must be shorter than or equal to 100 characters',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'description should not be empty',
      'description must be a string',
      'description must be shorter than or equal to 100 characters',
    ],
  },
  {
    message: ['categoryId should not be empty', 'categoryId must be a UUID'],
  },
  {
    message: ['userId should not be empty', 'userId must be a UUID'],
  },
];

export const userApiBody = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Nombre del Servicio' },
    description: {
      type: 'string',
      description: 'Descripcion del servicio',
    },
    categoryId: {
      type: 'string',
      description: 'Id de la categoria a la que pertenece el servicio',
    },
    userId: {
      type: 'string',
      description: 'Id del usuario que crea el servicio',
    },
  },
};

export const serviceNotFound = {
  status: 404,
  description: 'Servicio no encontrado',
  schema: {
    example: {
      message: 'Servicio no encontrado',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};
