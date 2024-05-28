import {
  Query,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PostulationsService } from './postulations.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  accessOnlyProfessional,
  exampleCreatedPostulation,
  postulationApiParam,
  postulationJobUserNotFound,
  postulationNotFound,
  postulationValidationsErrors,
} from './swaggerExample/postulation.swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';
import { internalServerError } from 'src/utils/swagger.utils';
import e from 'express';
import { error } from 'console';
import { ClosePostulation } from './dto/closePostulation.dto';

@Controller('postulations')
@ApiTags('Postulaciones')
@ApiResponse(internalServerError)
export class PostulationsController {
  constructor(private readonly postulationsService: PostulationsService) {}

  @ApiResponse({
    status: 201,
    description: 'Postulación creada',
    schema: {
      example: exampleCreatedPostulation,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o trabajo no encontrado',
    schema: {
      example: postulationJobUserNotFound,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación',
    schema: {
      example: postulationValidationsErrors,
    },
  })
  @ApiResponse(accessOnlyProfessional)
  @ApiOperation({
    summary: 'Crear postulación',
    description: 'Crea una postulación a un trabajo',
  })
  // @ApiBearerAuth()
  // @Roles(Role.PROFESSIONAL)
  // @UseGuards(GuardToken, guardRoles)
  @Post()
  create(@Body() createPostulationDto: CreatePostulationDto) {
    return this.postulationsService.create(createPostulationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Listar postulaciones',
    schema: {
      example: [exampleCreatedPostulation],
    },
  })
  @ApiOperation({
    summary: 'Listar postulaciones',
    description: 'Lista todas las postulaciones',
  })
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.postulationsService.findAll(pagination);
  }

  @ApiResponse({
    status: 200,
    description: 'Postulación encontrada',
    schema: {
      example: exampleCreatedPostulation,
    },
  })
  @ApiResponse(postulationNotFound)
  @ApiParam(postulationApiParam)
  @ApiOperation({
    summary: 'Buscar postulación',
    description: 'Busca una postulación por su id',
  })
  @ApiResponse(accessOnlyProfessional)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulationsService.findOne(id);
  }

  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Postulación eliminada',
    schema: {
      example: {
        message: `Postulacion con id: ${exampleCreatedPostulation.id} eliminada`,
      },
    },
  })
  @ApiResponse(postulationNotFound)
  @ApiResponse(accessOnlyProfessional)
  @ApiParam(postulationApiParam)
  @ApiOperation({
    summary: 'Eliminar postulación',
    description: 'Elimina una postulación por su id',
  })
  @Delete(':id')
  // @ApiBearerAuth()
  // @Roles(Role.PROFESSIONAL)
  // @UseGuards(GuardToken, guardRoles)
  remove(@Param('id') id: string) {
    return this.postulationsService.remove(id);
  }

  @Put('close')
  closePostulationByClient(@Body() closePostulation: ClosePostulation) {
    return this.postulationsService.closePostulationByClient(closePostulation);
  }
}
