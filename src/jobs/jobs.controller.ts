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
import { exampleCreatedJob } from './swaggerExamples/job.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { filterJobCategory } from 'src/dto/filterJob.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import { modifyJob } from 'src/interceptor/modifyJob.interceptor';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';


@Controller('jobs')
@ApiTags('jobs')
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
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The record  has been successfully created.',
    schema: {
      example: exampleCreatedJob,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found, Category Not Found',
  })
  @ApiResponse({
    status: 400,
    description: 'Action Just For Clients',
  })
  @ApiOperation({
    summary: 'Create a new Job',
    description: 'Endpoint to create a new Job',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string', description: 'Nombre del trabajo' },
        description: {
          type: 'string',
          description: 'Breve descripcion del trabajo',
        },
        base_price: {
          type: 'number',
          description: 'Precio base de postulacion',
        },
        categoryId: {
          type: 'string',
          description: 'Categoria del trabajo',
        },
        userId: {
          type: 'string',
          description: 'ID de Usuario',
        },
      },
    },
    required: false,
  })
  @ApiBearerAuth()
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
  @Roles(Role.CLIENT)
  @UseGuards(GuardToken, guardRoles)
  findAll(@Query() pagination?: PaginationQuery) {
    return this.jobsService.findAll(pagination);
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
  @ApiBearerAuth()
  // @Roles(Role.CLIENT)
  // @UseGuards(GuardToken, guardRoles)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.remove(id);
  }
}
