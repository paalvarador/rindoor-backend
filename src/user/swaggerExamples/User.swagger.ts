export const exampleCreatedUser = {
  id: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
  firstName: 'tomas',
  lastName: 'lopez',
  email: 'lopez@gmail.com',
  phone: '4345432343',
  address: 'CL 92B #98A',
  rating: '5.2',
  role: 'CLIENT',
};

export const alreadyExistsEmail = {
  message: 'Usuario ya existe',
  error: 'Bad Request',
  statusCode: 500,
};

export const userValidationsErrors = [
  {
    statusCode: 400,
    message: [
      'email must be an email',
      'email should not be empty',
      'email must be a string',
    ],
    error: 'Bad Request',
  },
  {
    message: [
      'firstName must be shorter than or equal to 50 characters',
      'firstName should not be empty',
      'firstName must be a string',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'lastName must be a string',
      'lastName should not be empty',
      'lastName must be shorter than or equal to 50 characters',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: ['Phone number must be 10 digits', 'phone should not be empty'],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'address should not be empty',
      'address must be a string',
      'address must be shorter than or equal to 100 characters',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'role should not be empty',
      'role must be a string',
      'role must be one of the following values: PROFESSIONAL, CLIENT, ADMIN',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: ['Usuario es requerido'],
    error: 'Bad Request',
    statusCode: 400,
  },
];

export const userAlreadyExists = {
  status: 409,
  description: 'El usuario ya existe',
  schema: {
    example: {
      message: 'User already exists',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};
