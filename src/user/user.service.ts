import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto) throw new BadRequestException('Usuario es requerido');
    const userDB = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userDB) throw new ConflictException('Usuario ya existe');
    const userToSave = { ...createUserDto, rating: 5.0 };
    const newUser = await this.userRepository.save(userToSave);
    return newUser;
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find();

    const sliceUsers = users.slice(startIndex, endIndex);
    return sliceUsers;
  }

  async findByEmail(email: string) {
    const userDB = await this.userRepository.findOne({ where: { email } });
    // if (!userDB) throw new NotFoundException('Usuario no encontrado');
    return userDB;
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    return findUser;
  }

  async addCategory(id: string, category: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: { category: true },
    });

    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    const categoryId = Object.values(category)[0];
    const userCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!userCategory) throw new NotFoundException('Category no Existe');

    if (userCategory.id !== foundUser.category?.id) {
      await this.userRepository.update(
        { id: foundUser.id },
        {
          category: userCategory,
        },
      );
      return 'Categoria agregada a usuario';
    } else {
      return 'Usuario ya tiene esta categoria';
    }
  }

  async update(id: string, updateCategoryDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.update(id, {
      ...updateCategoryDto,
    });
    return `Usuario actualizado`;
  }

  async remove(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.delete(foundUser);
    return `Usuario eliminado`;
  }
}
