import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto)
      throw new BadRequestException('Error to create category');

    const newCategory = await this.categoryRepository.save(createCategoryDto);
    return newCategory;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Category not found');

    return findCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('User notFound');

    await this.categoryRepository.update(id, { ...updateCategoryDto });
    return `Category ${findCategory.id} updated`;
  }

  async remove(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Category not found');

    await this.categoryRepository.delete(findCategory);
    return `${findCategory.name} is deleted`;
  }
}
