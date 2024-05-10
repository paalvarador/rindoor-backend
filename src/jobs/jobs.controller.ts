import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { exampleCreatedJob } from './swaggerExamples/job.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import { modifyJob } from 'src/interceptor/modifyJob.interceptor';

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
  @Post()
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
    description: 'find all Jobs',
  })
  @ApiOperation({
    summary: 'Find all Jobs',
    description: 'Endpoint to find all Jobs',
  })
  @Get()
  findAll() {
    return this.jobsService.findAll();
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

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.remove(id);
  }
}
