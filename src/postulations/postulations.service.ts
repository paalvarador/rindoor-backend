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
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { EmailService } from 'src/email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostulationCreatedEvent } from './PostulationCreatedEvent';
import { body2 } from 'src/utils/bodyPostulation';

@Injectable()
export class PostulationsService {
  constructor(
    @InjectRepository(Postulation)
    private postulationRepository: Repository<Postulation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private emailService: EmailService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createPostulationDto: CreatePostulationDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createPostulationDto.userId },
    });
    if (!findUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (findUser.role !== 'PROFESSIONAL')
      throw new BadRequestException('Acesso solo para los Profesionales');

    const findJob = await this.jobRepository.findOne({
      where: { id: createPostulationDto.jobId },
    });
    if (!findJob) throw new NotFoundException('Trabajo no encontrado');

    const newPostulation = {
      ...createPostulationDto,
      user: findUser,
      job: findJob,
    };

    const postulation = await this.postulationRepository.save(newPostulation);

    this.eventEmitter.emit(
      'postulation.created',
      new PostulationCreatedEvent(postulation.id),
    );
    console.log(postulation);
    return postulation;
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const postulations = await this.postulationRepository.find();
    const slicePostulations = postulations.slice(startIndex, endIndex);
    return slicePostulations;
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
    return `Postulacion con id: ${id} eliminada`;
  }

  @OnEvent('postulation.created')
  private async sendEmail(payload: PostulationCreatedEvent) {
    const postulationId = Object.values(payload)[0];
    console.log(postulationId, 'payload hola');

    const findPostulationById = await this.postulationRepository.findOne({
      where: {
        id: postulationId,
      },
      relations: ['user', 'job', 'job.user', 'job.category'],
    });

    const userClientEmail = findPostulationById.job.user.email;

    const template = body2(
      userClientEmail,
      'nuevapostulacion',
      findPostulationById,
    );

    const mail = {
      to: userClientEmail,
      subject: 'Nueva postutation',
      text: 'hola',
      template: template,
    };
    await this.emailService.sendPostulation(mail);
  }
}
