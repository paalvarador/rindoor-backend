import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { exampleCreatedCategory } from './swaggerExample/category.swagger';

@Controller('category')
@ApiTags('category')
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
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The record  has been successfully created.',
    schema: {
      example: exampleCreatedCategory,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error to create category',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string', description: 'Nombre de Cagegoria' },
        description: { type: 'string', description: 'Nombre de Cagegoria' },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeFile)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
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
    return this.categoryService.create(createCategoryDto, file);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Find all categories',
  })
  @ApiOperation({
    summary: 'Find all Categories',
    description: 'Endpoint to find all Category',
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Find category by ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiOperation({
    summary: 'Find category by ID',
    description: 'Endpoint to find category by ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Category updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists',
  })
  @ApiOperation({
    summary: 'update category',
    description: 'Endpoint to update a category',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string', description: 'Nombre de Cagegoria' },
        description: { type: 'string', description: 'Nombre de Cagegoria' },
      },
    },
    required: false,
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeFile)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Archivo debe ser menor a 200Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg)|(jpge)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File | null,
  ) {
    return this.categoryService.update(id, updateCategoryDto, file);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted',
  })
  @ApiOperation({
    summary: 'Delete category',
    description: 'Endpoint to delete a category',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
