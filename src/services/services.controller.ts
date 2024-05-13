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
// @ApiResponse(internalServerError)
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
    description: 'Find all Services',
    schema: {
      example: [exampleCreatedService],
    },
  })
  @ApiOperation({
    summary: 'Find all Services',
    description: 'Endpoint to find all Services',
  })
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.servicesService.findAll(pagination);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Encontrar servicio por ID',
    schema: {
      example: exampleCreatedService,
    },
  })
  @ApiResponse(serviceNotFound)
  @ApiOperation({
    summary: 'Find sergice by ID',
    description: 'Endpoint to find service by ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // TODO implementar la actualización de un servicio
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Service updated',
  })
  @ApiResponse(serviceNotFound)
  @ApiResponse({
    status: 409,
    description: 'Service already exists',
  })
  @ApiOperation({
    summary: 'update service',
    description: 'Endpoint to update a service',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nombre del servicio' },
        description: {
          type: 'string',
          description: 'Descripción del servicio',
        },
        categoryId: {
          type: 'string',
          description: 'Id de la categoria a la que pertenece el servicio',
        },
      },
    },
    required: false,
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Service deleted',
  })
  @ApiOperation({
    summary: 'Delete Service',
    description: 'Endpoint to delete a service',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
