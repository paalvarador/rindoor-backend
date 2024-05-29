export const exampleCreatedPostulation = {
  message: 'hola, a este precio',
  offered_price: 21.2,
  userId: 'c062a76f-fb01-44f7-94fe-9841e0086370',
  jobId: '70177f32-264e-462f-a88b-b899b040732d',
  user: {
    id: 'c062a76f-fb01-44f7-94fe-9841e0086370',
    firstName: 'Carlos2',
    lastName: 'Perez2',
    email: 'example2@gmail.com',
    phone: '1234567890',
    address: '33 626',
    rating: '5',
    role: 'PROFESSIONAL',
  },
  job: {
    id: '70177f32-264e-462f-a88b-b899b040732d',
    name: 'Licuadora danada',
    description: 'Necesito reparar licuadora, no enciende directamente',
    base_price: '36.50',
    status: 'active',
    created_at: '2024-05-10T08:31:03.055Z',
  },
  id: 'ae9adf60-a876-4045-af44-25e3eca75613',
  status: 'active',
  created_at: '2024-05-11T00:03:19.833Z',
};

export const postulationJobUserNotFound = [
  {
    message: 'Usuario no encontrado',
    error: 'Not Found',
    statusCode: 404,
  },
  {
    message: 'Trabajo no encontrado',
    error: 'Not Found',
    statusCode: 404,
  },
];

export const postulationValidationsErrors = [
  {
    message: 'message should not be empty',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'offered_price should not be empty',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'offered_price must be a positive number',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'userId must be an UUID',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'jobId must be an UUID',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'userId should not be empty',
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: 'jobId should not be empty',
    error: 'Bad Request',
    statusCode: 400,
  },
];

export const postulationNotFound = {
  status: 404,
  description: 'Postulation no encontrada',
  schema: {
    example: {
      message: 'Postulation not found',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

export const postulationClosed = {
  status: 400,
  description: 'Postulacion ya esta cerrada',
  schema: {
    example: {
      message: 'Postulacion ya Cerrada',
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

export const responsePostulationClosed = {
  message: 'Postulacion aceptada por el usuario',
  job: {
    id: '179b3890-6cc0-46a5-80b1-4c7edca71e50',
    banned: true,
    name: 'Limpiar la casa 3',
    description: 'Descripcion del trabajo',
    base_price: 200.2,
    status: 'InProgress',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'Mercedes',
    address: 'Calle 30 626',
    coords: '-34.6487099,-59.4301548',
    img: 'http://res.cloudinary.com/do66dg8ta/image/upload/v1716914591/kzhgcuwqeialpcwrqkvn.png',
    created_at: '2024-05-28T19:43:12.309Z',
  },
};

export const userUnauthorized = {
  status: 401,
  description: 'Usuario no autorizado',
  schema: {
    example: {
      message: 'Usuario no autorizado',
      error: 'Unauthorized',
      statusCode: 401,
    },
  },
};

export const postulationApiParam = {
  name: 'id',
  description: 'Id de la postulación',
  required: true,
  schema: {
    example: 'ae9adf60-a876-4045-af44-25e3eca75613',
  },
};

export const accessOnlyProfessional = {
  status: 401,
  description: 'Acceso solo para los Profesionales',
  schema: {
    example: {
      message: 'Acesso solo para los Profesionales',
      error: 'Unauthorized',
      statusCode: 401,
    },
  },
};
