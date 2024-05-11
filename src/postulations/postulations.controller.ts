import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { PostulationsService } from './postulations.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { exampleCreatedPostulation } from './swaggerExample/postulation.swagger';

@Controller('postulations')
@ApiTags('postulations')
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
export class PostulationsController {
  constructor(private readonly postulationsService: PostulationsService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The postulation  has been successfully created.',
    schema: {
      example: exampleCreatedPostulation,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or Job not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Action just for PROFESSIONAL',
  })
  @Post()
  create(@Body() createPostulationDto: CreatePostulationDto) {
    return this.postulationsService.create(createPostulationDto);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'find all postulations',
  })
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.postulationsService.findAll(pagination);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Postulation found',
  })
  @ApiResponse({
    status: 404,
    description: 'Postulation not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulationsService.findOne(id);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Postulation deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Postulation not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postulationsService.remove(id);
  }
}
