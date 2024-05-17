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
    await Promise.all(
      createUserDto.categories.map(async (category) => {
        const categoryDB = await this.categoryRepository.findOne({
          where: { id: category.id },
        });
        if (!categoryDB) throw new NotFoundException('Categoria no existe');
      }),
    );

    const userDB = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userDB) throw new ConflictException('Usuario ya existe');
    const userToSave = { ...createUserDto, rating: 5.0 };
    console.log(userToSave, '*********');
    const newUser = await this.userRepository.save(userToSave);
    return newUser;
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find({
      relations: ['categories'],
    });

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

  async addCategory(id: string, categoryId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: { categories: true },
    });

    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    const categoryToAdd = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!categoryToAdd) throw new NotFoundException('Category no Existe');

    const idsCategories = foundUser.categories.map((category) => category.id);
    if (!idsCategories.includes(categoryToAdd.id)) {
      foundUser.categories.push(categoryToAdd);
      await this.userRepository.save(foundUser);
      return categoryToAdd;
    }
    return 'Usuario ya tiene esta categoria';
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

    await this.userRepository.delete({ id: id });
    return `Usuario eliminado`;
  }

  async setSubscription(
    subscriptionId: string,
    customerId: string,
    emailUser: string,
    planId: string,
  ) {
    const user = await this.userRepository.findOneBy({ email: emailUser });
    console.log('***********LLEGA AQUI***********');

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.update(
      { email: emailUser },
      {
        planId,
        customerId,
        subscriptionId,
      },
    );
  }

  async setSubscriptionId(
    subscriptionId: string,
    userEmail: string,
    planId: string,
    customerId: string,
  ) {
    const user = await this.findByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.update(user.id, {
      planId,
      customerId,
      subscriptionId,
    });
  }
}
