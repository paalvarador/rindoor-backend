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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    if (!userDB) throw new NotFoundException('Usuario no encontrado');
    return userDB;
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    return findUser;
  }

  async update(id: string, updateCategoryDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.update(id, { ...updateCategoryDto });
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
