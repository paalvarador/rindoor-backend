import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { internalServerError } from 'src/utils/swagger.utils';
import {
  exampleCreatedUser,
  userAlreadyExists,
  userValidationsErrors,
} from 'src/user/swaggerExamples/User.swagger';
import { webcrypto } from 'crypto';
import { escape } from 'querystring';
import { modifyRole } from 'src/interceptor/mofifyRole.interceptor';
import { modifyUserCreate } from 'src/interceptor/modifyUserCreate';
import { validateRoleUser } from 'src/pipes/validateRoleUser';

@Controller('auth')
@ApiTags('Autenticacion')
@ApiResponse(internalServerError)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesion exitoso',
    schema: {
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlkIjoxLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFETUlOIn0.1',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({
    summary: 'Inicio de sesion',
    description: 'Inicio de sesion',
  })
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;
    const response = await this.authService.signIn(email);
    return response;
  }

  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validacion fallida',
    schema: {
      example: userValidationsErrors,
    },
  })
  @ApiResponse(userAlreadyExists)
  @ApiOperation({
    summary: 'Registro de usuario',
    description: 'Registro de usuario',
  })
  @UseInterceptors(modifyUserCreate, modifyRole)
  @UsePipes(validateRoleUser)
  @Post('signup')
  async singup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
}
