import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  exampleCreatedService,
  serviceNotFound,
  userApiBody,
} from './swaggerExample/services.swagger';
import { internalServerError } from 'src/utils/swagger.utils';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken2 } from 'src/guards/token2.guard';
import { guardRoles } from 'src/guards/role.guard';
import { userValidationsErrors } from 'src/user/swaggerExamples/User.swagger';

@Controller('services')
@ApiTags('Servicios')
// @ApiBearerAuth()
@ApiResponse(internalServerError)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken2, guardRoles)
  @ApiResponse({
    status: 201,
    description: 'Servicio creado',
    schema: {
      example: exampleCreatedService,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación',
    schema: {
      example: userValidationsErrors,
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Servicio ya existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria o usuario no encontrados',
    schema: {
      example: [
        {
          message: 'Categoria no encontrada',
        },
        {
          message: 'Usuario no encontrado',
        },
      ],
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      ...userApiBody,
      required: ['name', 'description', 'categoryId', 'userId'],
    },
  })
  @ApiOperation({
    summary: 'Crear servicio',
    description: 'Endpoint para crear un servicio',
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    schema: {
      example: [exampleCreatedService],
    },
  })
  @ApiOperation({
    summary: 'Listar servicios',
    description: 'Endpoint para listar servicios',
  })
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.servicesService.findAll(pagination);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Encuentra un servicio por ID',
    schema: {
      example: exampleCreatedService,
    },
  })
  @ApiResponse(serviceNotFound)
  @ApiOperation({
    summary: 'Encontrar servicio por ID',
    description: 'Endpoint para encontrar un servicio por ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken2, guardRoles)
  @ApiResponse({
    status: 201,
    description: 'Servicio actualizado',
    schema: {
      example: exampleCreatedService,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación',
    schema: {
      example: userValidationsErrors,
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Servicio ya existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria, usuario o servicio no encontrados',
    schema: {
      example: [
        {
          message: 'Categoria no encontrada',
        },
        {
          message: 'Usuario no encontrado',
        },
        {
          message: 'Servicio no encontrado',
        },
      ],
    },
  })
  @ApiBody({
    schema: {
      ...userApiBody,
      required: [],
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar Servicio',
    description: 'Endpoint para actualizar un servicio',
  })
  @ApiParam({
    name: 'id',
    description: 'Id del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @HttpCode(204)
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken2, guardRoles)
  @ApiResponse({
    status: 204,
    description: 'Servicio eliminado',
  })
  @ApiResponse({
    status: 404,
    description: 'Servicio no encontrado',
    schema: {
      example: {
        message: 'Servicio no encontrado',
      },
    },
  })
  @ApiOperation({
    summary: 'Eliminar Servicio',
    description: 'Endpoint para eliminar un servicio',
  })
  @ApiParam({
    name: 'id',
    description: 'Id del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
