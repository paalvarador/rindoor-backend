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
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { FileUpload } from 'src/cloudinary/FileUpload';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private fileUploadService: FileUpload,
  ) {}

  async create(createJobDto: CreateJobDto, file) {
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

    let imgUrl: string;
    if (file) {
      const imgUpload = await this.fileUploadService.uploadImg(file);
      if (!imgUpload) {
        throw new BadRequestException('Image upload failed');
      }
      imgUrl = imgUpload.url;
    }
    console.log(createJobDto);
    console.log(file);

    const newJob = {
      ...createJobDto,
      category: foundCategory,
      user: foundUser,
      img: imgUrl,
    };
    console.log(newJob, 'created');
    return await this.jobRepository.save(newJob);
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    console.log(defaultLimit, defaultPage);

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const jobs = await this.jobRepository.find({
      relations: { category: true },
    });

    const sliceJobs = jobs.slice(startIndex, endIndex);
    return sliceJobs;
  }

  async filterByCategory(category, pagination) {
    const filterCategory = Object.values(category)[0];
    const findJob = await this.jobRepository.find({
      relations: { category: true },
    });

    //*Paginado
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const filterJob = await findJob.filter(
      (job) => job.category.name === filterCategory,
    );

    if (filterJob.length === 0) return { message: 'No jobs for this category' };

    const sliceJobs = filterJob.slice(startIndex, endIndex);
    return sliceJobs;
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
