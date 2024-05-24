import { HttpStatus } from '@nestjs/common';

export const exampleCreatedJob = {
  id: '0ced5cea-3557-4d16-bfeb-8e647aefb641',
  name: 'Licuadora danada',
  description: 'Necesito reparar licuadora, no enciende directamente',
  base_price: 36.5,
  categoryId: 'cfc48688-57ca-43d2-9f1d-88c8a236aefe',
  userId: '18908870-475e-42e1-9620-588c38221377',
};

export const validationErrorsJob = [
  {
    message: [
      'name should not be empty',
      'name must be a string',
      'description should not be empty',
      'description must be a string',
      'base_price should not be empty',
      'base_price must be a positive number',
      'base_price must be a number conforming to the specified constraints',
      'categoryId should not be empty',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'Archivo debe ser menor a 200Kb',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message:
      'Validation failed (expected type is /(jpg)|(jpeg)|(png)|(webp)$/)',
    error: 'Bad Request',
    statusCode: 400,
  },
];

export const jobNotFound = {
  status: 404,
  description: 'Trabajo no encontrado',
  schema: {
    example: {
      message: 'Trabajo no encontrado',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

export const joblreadyExists = {
  message: 'Job ya existe',
  error: 'Conflict',
  statusCode: 409,
};

export const jobServiceUnavailable = {
  message: 'Error al subir la imagen',
  error: 'Bad Request',
  statusCode: HttpStatus.SERVICE_UNAVAILABLE,
};

export const jobParamId = {
  name: 'id',
  description: 'ID del trabajo',
  example: exampleCreatedJob.id,
};

export const jobApiBody = {
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary' },
      name: {
        type: 'string',
        description: 'Nombre del trabajo',
        example: 'Limpiar la casa 3',
      },
      description: {
        type: 'string',
        description: 'Breve descripcion del trabajo',
        example: 'Descripcion del trabajo',
      },
      base_price: {
        type: 'number',
        description: 'Precio base de postulacion',
        example: 100000.99,
      },
      categoryId: {
        type: 'string',
        description: 'Categoria del trabajo',
        example: '36fda476-60ba-4da8-ae02-c9c1d9c3abf8',
      },
      country: {
        type: 'string',
        description: 'Pais del trabajo a realizar',
        example: 'Argentina',
      },
      province: {
        type: 'string',
        description: 'Provincia del trabajo a realizar',
        example: 'Buenos Aires',
      },
      city: {
        type: 'string',
        description: 'Ciudad del trabajo a realizar',
        example: 'Mercedes',
      },
      address: {
        type: 'string',
        description: 'Direccion del trabajo a realizar',
        example: 'Calle 30 626',
      },
      userId: {
        type: 'string',
        description: 'ID de Usuario',
        example: '18908870-475e-42e1-9620-588c38221377',
      },
    },
    required: [
      'name',
      'description',
      'base_price',
      'categoryId',
      'userId',
      'file',
      'country',
      'province',
      'city',
      'address',
    ],
  },
};
