import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { In, Repository } from 'typeorm';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/User.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const categoryDB = await this.categoryRepository.findOneBy({
      id: createServiceDto.categoryId,
    });
    if (!categoryDB) throw new NotFoundException('Categoria no encontrada');

    const userDB = await this.userRepository.findOneBy({
      id: createServiceDto.userId,
    });
    if (!userDB) throw new NotFoundException('Usuario no encontrado');

    return await this.servicesRepository.save(createServiceDto);
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    console.log(defaultLimit, defaultPage);

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const services = await this.servicesRepository.find();

    const sliceServices = services.slice(startIndex, endIndex);
    return sliceServices;
  }

  async findOne(id: string) {
    const serviceDB =  await this.servicesRepository.findOne({
      where: { id },
    });
    if(!serviceDB) throw new NotFoundException('Servicio no encontrado');
    return serviceDB;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) throw new NotFoundException('Servicio no encontrado');

    if (service.name === updateServiceDto.name)
      throw new ConflictException('Servicio ya existe');

    return await this.servicesRepository.update(id, service);
  }

  async remove(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) throw new NotFoundException('Servicio no encontrado');

    return await this.servicesRepository.delete(id);
  }
}
