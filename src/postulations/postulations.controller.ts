import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostulationsService } from './postulations.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';

@Controller('postulations')
export class PostulationsController {
  constructor(private readonly postulationsService: PostulationsService) {}

  @Post()
  create(@Body() createPostulationDto: CreatePostulationDto) {
    return this.postulationsService.create(createPostulationDto);
  }

  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.postulationsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postulationsService.remove(id);
  }
}
