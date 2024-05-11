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
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { exampleCreatedJob } from './swaggerExamples/job.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';

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
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
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
  findAll(@Query() pagination?: PaginationQuery) {
    return this.jobsService.findAll(pagination);
  }

  @Get('category')
  filterByCategory(@Body() category: any) {
    return this.jobsService.filterByCategory(category);
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
