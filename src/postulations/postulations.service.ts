import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Postulation } from './entities/postulation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class PostulationsService {
  constructor(
    @InjectRepository(Postulation)
    private postulationRepository: Repository<Postulation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}
  async create(createPostulationDto: CreatePostulationDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createPostulationDto.userId },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    if (findUser.role !== 'PROFESSIONAL')
      throw new BadRequestException('Action just for PROFESSIONAL');

    const findJob = await this.jobRepository.findOne({
      where: { id: createPostulationDto.jobId },
    });
    if (!findJob) throw new NotFoundException('Job not found');

    const newPostulation = {
      ...createPostulationDto,
      user: findUser,
      job: findJob,
    };
    return await this.postulationRepository.save(newPostulation);
  }

  async findAll() {
    return await this.postulationRepository.find();
  }

  async findOne(id: string) {
    const findPostulation = await this.postulationRepository.findOne({
      where: { id: id },
    });
    if (!findPostulation) throw new NotFoundException('Postulation not found');

    return findPostulation;
  }

  async remove(id: string) {
    const findPostulation = await this.postulationRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!findPostulation) throw new NotFoundException('Postulation not found');

    console.log(findPostulation.user, 'role');
    if (findPostulation.user.role !== 'PROFESSIONAL')
      throw new BadRequestException('Actions just for PROFESSIONAL');

    await this.postulationRepository.remove(findPostulation);
    return `This action removes a #${id} postulation`;
  }
}
