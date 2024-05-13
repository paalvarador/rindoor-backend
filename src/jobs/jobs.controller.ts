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
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { exampleCreatedJob, jobApiBody } from './swaggerExamples/job.swagger';
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
      example: {
        message: 'Error de validación',
        errors: [
          {
            message: 'Archivo debe ser menor a 200Kb',
          },
          {
            message: 'Accesso solo para los Clientes',
          },
        ],
      },
    },
  })
  @ApiOperation({
    summary: 'Create a new Job',
    description: 'Endpoint to create a new Job',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    ...jobApiBody,
    required: false,
  })
  //@ApiBearerAuth()
  @Post()
  // @Roles(Role.CLIENT)
  // @UseGuards(GuardToken, guardRoles)
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
    console.log(createJobDto);
    return this.jobsService.create(createJobDto, file);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'find all Jobs',
  })
  @ApiOperation({
    summary: 'Find all Jobs',
    description: 'Endpoint to find all Jobs',
  })
  @Get()
  // @Roles(Role.CLIENT)
  //@UseGuards(GuardToken, guardRoles)
  findAll(@Query() filter?: filterJobCategory) {
    return this.jobsService.findAll(filter);
  }

  @Get('category')
  filterByCategory(
    @Body() category: filterJobCategory,
    @Query() pagination?: PaginationQuery,
  ) {
    return this.jobsService.filterByCategory(category, pagination);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'All Jobs find Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  @ApiOperation({
    summary: 'Find Job By ID',
    description: 'Endpoint to find a Job by ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Job deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  //  @ApiBearerAuth()
  // @Roles(Role.CLIENT)
  // @UseGuards(GuardToken, guardRoles)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.remove(id);
  }
}
