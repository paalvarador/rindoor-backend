import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  exampleCreatedUser,
  userAlreadyExists,
  userValidationsErrors,
} from './swaggerExamples/User.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from './entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';
import { GuardToken2 } from 'src/guards/token2.guard';
import { internalServerError } from 'src/utils/swagger.utils';

@Controller('users')
@ApiTags('Usuarios')
@ApiResponse(internalServerError)
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    summary: 'Crear un usuario',
    description: 'Crea un usuario en la base de datos',
  })
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @ApiResponse({
    status: 200,
    description: 'Listar todos los usuarios exitosamente',
    schema: {
      example: [exampleCreatedUser],
    },
  })
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Lista todos los usuarios en la base de datos',
  })
  // @Roles(Role.ADMIN)
  //@UseGuards(GuardToken2, guardRoles)
  //@ApiUnauthorizedResponse()
  //@ApiBearerAuth()
  @Get()
  async findAll(@Query() pagination?: PaginationQuery): Promise<User[]> {
    const usersDB = await this.userService.findAll(pagination);
    return usersDB;
  }

  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Id del usuario',
    example: 'cf804394-620e-4108-bafe-64be9c662a0e',
    required: true,
    schema: {
      type: 'string',
    },
  })
  @ApiOperation({
    summary: 'Encontrar usuario por ID',
    description: 'Encuentra un usuario por su ID',
  })
  //@Roles(Role.ADMIN, Role.CLIENT, Role.PROFESSIONAL)
  //@UseGuards(GuardToken2, guardRoles)
  //@ApiUnauthorizedResponse()
  //@ApiBearerAuth()
  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Put('/:id')
  // @Roles(Role.CLIENT, Role.PROFESSIONAL)
  // @UseGuards(GuardToken2, guardRoles)
  //  @ApiBearerAuth()
  //@ApiUnauthorizedResponse()
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    schema: {
      example: {
        message: 'Usuario actualizado',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validacion fallida',
    schema: {
      example: userValidationsErrors,
    },
  })
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza un usuario en la base de datos',
  })
  @ApiParam({
    name: 'id',
    description: 'Id del usuario',
    example: 'cf804394-620e-4108-bafe-64be9c662a0e',
    required: true,
    schema: {
      type: 'string',
    },
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    console.log(updateUserDto);
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  @Delete('/:id')
  // @Roles(Role.CLIENT, Role.PROFESSIONAL)
  // @UseGuards(GuardToken2, guardRoles)
  //@ApiUnauthorizedResponse()
  //@ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Usuario eliminado',
  })
  @ApiResponse(userAlreadyExists)
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<string> {
    const deletedUser = await this.userService.remove(id);
    return deletedUser;
  }
}
