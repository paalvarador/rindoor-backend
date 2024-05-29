import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
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
  exampleCreatedJob,
  jobApiBody,
  jobNotFound,
  jobParamId,
  jobServiceUnavailable,
  validationErrorsJob,
} from './swaggerExamples/job.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { filterJobCategory } from 'src/dto/filterJob.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import { modifyJob } from 'src/interceptor/modifyJob.interceptor';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';
import { internalServerError } from 'src/utils/swagger.utils';
import { error } from 'console';
import { FinishJob } from './dto/finishJob.dto';

@Controller('jobs')
@ApiTags('Trabajos')
@ApiResponse(internalServerError)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiResponse({
    status: 201,
    description: 'Trabajo creado',
    schema: {
      example: exampleCreatedJob,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o Categoria no encontrada',
    schema: {
      example: [
        {
          message: 'Usuario no encontrado',
        },
        {
          message: 'Categoria no encontrada',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación',
    schema: {
      example: validationErrorsJob,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        message: 'Accesso solo para los Clientes',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Error al subir la imagen',
    schema: {
      example: jobServiceUnavailable,
    },
  })
  @ApiOperation({
    summary: 'Crear un Trabajo',
    description: 'Endpoint para crear un Trabajo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    ...jobApiBody,
  })
  @Post()
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(GuardToken, guardRoles)
  @UseInterceptors(modifyJob)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeFile)
  create(
    @Body() createJobDto: CreateJobDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Archivo debe ser menor a 200Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg)|(jpeg)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.jobsService.create(createJobDto, file);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Listar Trabajos',
    schema: {
      example: [exampleCreatedJob],
    },
  })
  @ApiOperation({
    summary: 'Listar Trabajos',
    description: 'Endpoint para listar los Trabajos',
  })
  @Get()
  // @Roles(Role.CLIENT)
  //@UseGuards(GuardToken, guardRoles)
  findAll(@Query() filter?: filterJobCategory) {
    return this.jobsService.findAll(filter);
  }

  @ApiResponse({
    status: 200,
    description: 'Trabajo encontrado',
    schema: {
      example: exampleCreatedJob,
    },
  })
  @ApiResponse(jobNotFound)
  @ApiOperation({
    summary: 'Encontrar un Trabajo por ID',
    description: 'Endpoint to encontrar un Trabajo por ID',
  })
  @ApiParam(jobParamId)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @Put('finish')
  finishJob(@Body() finishJob: FinishJob) {
    return this.jobsService.finishJob(finishJob);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, guardRoles)
  @Put('banned/:id')
  banJob(@Param('id', ParseUUIDPipe) jobId: string) {
    return this.jobsService.banJob(jobId);
  }

  // @HttpCode(204)
  // @ApiResponse({
  //   status: 204,
  //   description: 'Trabajo eliminado',
  //   schema: {
  //     example: 'Trabajo con id: 5e9d7f4d-7b1f-4d6c-8e0d-4b7e6f7b1b4d eliminado',
  //   },
  // })
  // @ApiResponse(jobNotFound)
  // @ApiParam(jobParamId)
  // @ApiOperation({
  //   summary: 'Eliminar un Trabajo por ID',
  //   description: 'Endpoint para eliminar un Trabajo por ID',
  // })
  //  @ApiBearerAuth()
  // @Roles(Role.CLIENT)
  // @UseGuards(GuardToken, guardRoles)
  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.jobsService.remove(id);
  // }
}
