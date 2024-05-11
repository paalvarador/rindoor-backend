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
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { exampleCreatedServices } from './swaggerExample/services.swagger';

@Controller('services')
@ApiTags('services')
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    example: {
      statusCode: 500,
      message: 'Internal server error',
    },
  },
})
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The record  has been successfully created.',
    schema: {
      example: exampleCreatedServices,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error to create services',
  })
  @ApiResponse({
    status: 409,
    description: 'Service already exists',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
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
      },
    },
  })
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Find all Services',
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
    description: 'Find Service by ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @ApiOperation({
    summary: 'Find sergice by ID',
    description: 'Endpoint to find service by ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Service updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
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
