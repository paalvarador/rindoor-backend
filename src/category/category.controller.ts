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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeFile } from 'src/pipes/minSizeFile';
import { ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
            fileType: /(jpg)|(jpge)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, file);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
