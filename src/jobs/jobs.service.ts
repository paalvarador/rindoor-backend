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
