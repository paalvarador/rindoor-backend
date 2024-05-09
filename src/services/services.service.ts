import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    return await this.servicesRepository.save(createServiceDto);
  }

  async findAll() {
    return await this.servicesRepository.find();
  }

  async findOne(id: string) {
    return await this.servicesRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) throw new NotFoundException('service not found');

    if (service.name === updateServiceDto.name)
      throw new ConflictException('Service already exists');

    return await this.servicesRepository.update(id, service);
  }

  async remove(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) throw new NotFoundException('Service not found');

    return await this.servicesRepository.delete(id);
  }
}
