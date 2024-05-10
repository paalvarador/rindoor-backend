import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role } from './entities/Role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto)
      throw new BadRequestException('Error to create category');
    const userDB = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userDB) throw new BadRequestException('User already exists');
    const userToSave = { ...createUserDto, rating: 5.0 };
    const newUser = await this.userRepository.save(userToSave);
    return newUser;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!findUser) throw new NotFoundException('User not found');

    return findUser;
  }

  async update(id: string, updateCategoryDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('User notFound');

    await this.userRepository.update(id, { ...updateCategoryDto });
    return `Category ${foundUser.id} updated`;
  }

  async remove(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Category not found');

    await this.userRepository.delete(foundUser);
    return `${foundUser.email} is deleted`;
  }
}
