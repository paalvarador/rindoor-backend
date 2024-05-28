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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  categoryAlreadyExists,
  categoryApiBody,
  categoryNotFound,
  categoryParamId,
  categoryServiceUnavailable,
  exampleCreatedCategory,
  validationErrorsCategory,
} from './swaggerExample/category.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { internalServerError } from 'src/utils/swagger.utils';
import { GuardToken2 } from 'src/guards/token2.guard';
import { guardRoles } from 'src/guards/role.guard';
import { Role } from 'src/user/entities/Role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { GuardToken } from 'src/guards/token.guard';

@Controller('category')
@ApiTags('Categorias')
@ApiResponse(internalServerError)
@ApiUnauthorizedResponse()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Categoria exitosamente creada',
    schema: {
      example: exampleCreatedCategory,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validacion al crear la categoria',
    schema: {
      example: validationErrorsCategory,
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Error al subir la imagen',
    schema: {
      example: categoryServiceUnavailable,
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Categoria ya existe',
    schema: {
      example: categoryAlreadyExists,
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      ...categoryApiBody,
      required: ['name', 'description', 'file'],
    },
  })
  @ApiOperation({
    summary: 'Crear categoria',
    description: 'Endpoint para crear una nueva categoria',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeFile)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, guardRoles)
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
    description: 'Listar todas las categorias',
    schema: {
      example: [exampleCreatedCategory],
    },
  })
  @ApiOperation({
    summary: 'Listar todas las categorias',
    description: 'Endpoint para listar todas las categorias',
  })
  // @Roles(Role.ADMIN, Role.CLIENT, Role.PROFESSIONAL)
  // @UseGuards(GuardToken2, guardRoles)
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.categoryService.findAll(pagination);
  }

  @HttpCode(200)
  //@Roles(Role.CLIENT, Role.PROFESSIONAL)
  //@UseGuards(GuardToken2, guardRoles)
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    schema: {
      example: exampleCreatedCategory,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria no encontrada',
    schema: {
      example: categoryNotFound,
    },
  })
  @ApiOperation({
    summary: 'Encontrar categoria por ID',
    description: 'Endpoint para encontrar una categoria por ID',
  })
  // @Roles(Role.ADMIN, Role.CLIENT, Role.PROFESSIONAL)
  //@UseGuards(GuardToken2, guardRoles)
  @Get(':id')
  @ApiParam(categoryParamId)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: `Categoria ${exampleCreatedCategory.name} actualizada`,
    schema: {
      example: exampleCreatedCategory,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria no encontrada',
    schema: {
      example: categoryNotFound,
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Categoria ya existe',
    schema: {
      example: categoryAlreadyExists,
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Error al subir la imagen',
    schema: {
      example: categoryServiceUnavailable,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validacion al actualizar la categoria',
    schema: {
      example: validationErrorsCategory,
    },
  })
  @ApiOperation({
    summary: 'Actualizar categoria',
    description: 'Endpoint para actualizar una categoria',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      ...categoryApiBody,
      required: [],
    },
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeFile)
  @ApiParam(categoryParamId)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, guardRoles)
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

  @HttpCode(204)
  @ApiResponse({
    status: 404,
    description: 'Categoria no encontrada',
    schema: {
      example: categoryNotFound,
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Categoria eliminada',
    schema: {
      example: 'Electricidad eliminada',
    },
  })
  @ApiOperation({
    summary: 'Eliminar categoria',
    description: 'Endpoint para eliminar una categoria',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, guardRoles)
  @ApiParam(categoryParamId)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
