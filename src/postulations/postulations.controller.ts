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
} from '@nestjs/common';
import { PostulationsService } from './postulations.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { exampleCreatedPostulation } from './swaggerExample/postulation.swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';

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
  @ApiBearerAuth()
  @Post()
  @Roles(Role.PROFESSIONAL)
  @UseGuards(GuardToken, guardRoles)
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
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.PROFESSIONAL)
  @UseGuards(GuardToken, guardRoles)
  remove(@Param('id') id: string) {
    return this.postulationsService.remove(id);
  }
}
