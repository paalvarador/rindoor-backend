import { HttpStatus } from '@nestjs/common';

export const exampleCreatedCategory = {
  id: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
  name: 'Electricidad',
  description: 'Tareas para el mantenimiento de instalaciones electricas...',
  img: 'http://res.cloudinary.com/do66dg8ta/image/upload/v1715289458/a8fun1cwsq1ogjwz3ush.png',
};

export const validationErrorsCategory = [
  {
    message: [
      'name must be shorter than or equal to 50 characters',
      'name should not be empty',
      'name must be a string',
      'description should not be empty',
      'description must be a string',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'description should not be empty',
      'description must be a string',
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

export const categoryNotFound = {
  message: 'Category not found',
  error: 'Not Found',
  statusCode: 404,
};

export const categoryAlreadyExists = {
  message: 'Categoria ya existe',
  error: 'Conflict',
  statusCode: 409,
};

export const categoryServiceUnavailable = {
  message: 'Error al subir la imagen',
  error: 'Bad Request',
  statusCode: HttpStatus.SERVICE_UNAVAILABLE,
};

export const categoryParamId = {
  name: 'id',
  description: 'ID de la categoria',
  example: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
};

export const categoryApiBody = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
      description: 'Imagen de la categoria',
    },
    name: {
      type: 'string',
      description: 'Nombre de Categoria',
      example: 'Electricidad',
    },
    description: {
      type: 'string',
      description: 'Descripcion de la categoria',
      example: 'Tareas para el mantenimiento de instalaciones electricas...',
    },
  },
};
