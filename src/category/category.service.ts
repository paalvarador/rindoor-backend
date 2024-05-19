import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'src/cloudinary/FileUpload';
import { PaginationQuery } from 'src/dto/pagintation.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private fileUploadService: FileUpload,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, file) {
    if (!createCategoryDto && !file)
      throw new BadRequestException('Error al crear la categoria');

    const findCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (findCategory) throw new ConflictException('Categoria ya existe');

    let imgUrl: string;
    if (file) {
      const imgUpload = await this.fileUploadService.uploadImg(file);
      if (!imgUpload) {
        throw new HttpException(
          'Error al subir la imagen',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      imgUrl = imgUpload.url;
    }

    const newCategory = {
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      img: imgUrl,
    };

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 50;


    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const categories = await this.categoryRepository.find();

    const sliceCategories = categories.slice(startIndex, endIndex);
    return sliceCategories;
  }

  async findOne(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Categoria no encontrada');

    return findCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, file) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Categoria no encontrada');

    if (findCategory.name === updateCategoryDto.name)
      throw new ConflictException('Categoria ya existe');

    let imgUrl: string;
    if (file) {
      const imgUpload = await this.fileUploadService.uploadImg(file);
      if (!imgUpload) {
        throw new HttpException(
          'Error al subir la imagen',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      imgUrl = imgUpload.url;
    }

    const updateCategory = {
      ...updateCategoryDto,
      img: imgUrl || findCategory.img,
    };

    await this.categoryRepository.update(id, { ...updateCategory });
    return `Categoria ${findCategory.name} actualizada`;
  }

  async remove(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Categoria no encontrada');

    await this.categoryRepository.delete(findCategory);
    return `${findCategory.name} eliminada`;
  }
}
