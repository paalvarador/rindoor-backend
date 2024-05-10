import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: createJobDto.userId },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    if (foundUser.role !== 'CLIENT')
      throw new BadRequestException('Action just for Clients');

    const foundCategory = await this.categoryRepository.findOne({
      where: { id: createJobDto.categoryId },
    });
    if (!foundCategory) throw new NotFoundException('Category not found');

    const newJob = {
      ...createJobDto,
      category: foundCategory,
      user: foundUser,
    };
    return await this.jobRepository.save(newJob);
  }

  async findAll() {
    return await this.jobRepository.find();
  }

  async findOne(id: string) {
    const findJob = await this.jobRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!findJob) throw new NotFoundException('Job not found');

    return findJob;
  }

  async remove(id: string) {
    const findJob = await this.jobRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!findJob) throw new NotFoundException('Job not found');

    if (findJob.user.role !== 'CLIENT')
      throw new BadRequestException('Action just for Clients');

    await this.jobRepository.remove(findJob);
    return `Job ${id} deleted successfully`;
  }
}
