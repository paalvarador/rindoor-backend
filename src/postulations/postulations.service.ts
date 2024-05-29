import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Postulation, PostulationStatus } from './entities/postulation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { Job, JobStatus } from 'src/jobs/entities/job.entity';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { EmailService } from 'src/email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PostulationCreatedEvent } from './PostulationCreatedEvent';
import { body2 } from 'src/utils/bodyPostulation';
import { ClosePostulation } from './dto/closePostulation.dto';
import { PostulationClosedEvent } from './PostulationClosedEvent';
import { generatePostulationClosed } from 'src/utils/bodyPostulationClosed';

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
      relations: { categories: true },
    });
    if (!findUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (findUser.isActive === false)
      return { message: 'usuario baneado', user: findUser };

    if (findUser.role !== 'PROFESSIONAL')
      throw new BadRequestException('Acesso solo para los Profesionales');

    if (findUser.subscriptionId === null)
      throw new UnauthorizedException("Profesional sin Suscripcion no puede postularse")

    const findJob = await this.jobRepository.findOne({
      where: { id: createPostulationDto.jobId },
      relations: ['category', 'postulations'],
    });

    if (!findJob) throw new NotFoundException('Trabajo no encontrado');

    const postulationsDB = await Promise.all(
      findJob.postulations.map(async (postulation) => {
        return await this.postulationRepository.findOne({
          where: { id: postulation.id },
          relations: ['user'],
        });
      }),
    );
    const userAlreadyPostulate = postulationsDB.some(
      (postulation) => postulation.user.id === findUser.id,
    );
    if (userAlreadyPostulate)
      throw new BadRequestException('Usuario ya postulado a este trabajo');

    if (
      !findUser.categories.find(
        (category) => category.name === findJob.category.name,
      )
    )
      throw new UnauthorizedException('Usuario no posee esta categoria');
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
    return postulation;
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const postulations = await this.postulationRepository.find({
      relations: ['user', 'job', 'job.professional'],
    });
    const slicePostulations = postulations.slice(startIndex, endIndex);
    return slicePostulations;
  }

  //*CLIENT
  async closePostulationByClient(closePostulation: ClosePostulation) {
    const findUser = await this.userRepository.findOne({
      where: { id: closePostulation.userId },
      relations: ['jobsAsClient', 'jobsAsClient.postulations'],
    });

    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    const findPostulation = await this.postulationRepository.findOne({
      where: { id: closePostulation.postulationId },
      relations: ['job', 'user', 'job.client'],
    });

    if (!findPostulation)
      throw new NotFoundException('Postulacion no encontrada');
    if (findPostulation.job.client.id !== findUser.id)
      throw new UnauthorizedException('Usuario no autorizado');
    if (findPostulation.status === PostulationStatus.CLOSED)
      throw new BadRequestException('Postulacion ya cerrada');

    const samePostulation = findUser.jobsAsClient.find((job) =>
      job.postulations.some(
        (postulation) => postulation.id === closePostulation.postulationId,
      ),
    );

    if (!samePostulation)
      throw new NotFoundException(
        'Postulacion no encontrada en los trabajos del usuario',
      );

    await this.postulationRepository.update(
      { id: closePostulation.postulationId },
      { status: PostulationStatus.CLOSED },
    );

    await this.jobRepository.update(
      { id: samePostulation.id },
      { status: JobStatus.InProgress, professional: findPostulation.user },
    );

    const sendJob = await this.jobRepository.findOne({
      where: { id: samePostulation.id },
    });

    this.eventEmitter.emit(
      'postulation.closed',
      new PostulationClosedEvent(findPostulation.id),
    );

    return { message: 'Postulacion aceptada por el usuario', job: sendJob };
  }

  async findOne(id: string) {
    const findPostulation = await this.postulationRepository.findOne({
      where: { id: id },
      relations: ['user', 'job', 'job.professional'],
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

    const findPostulationById = await this.postulationRepository.findOne({
      where: {
        id: postulationId,
      },
      relations: [
        'user',
        'user.categories',
        'job',
        'job.client',
        'job.category',
      ],
    });
    findPostulationById.user.categories;
    const userClientEmail = findPostulationById.job.client.email;

    const template = body2(
      userClientEmail,
      `Nueva postutation al trabajo ${findPostulationById.job.name}`,
      findPostulationById,
      findPostulationById.job,
      findPostulationById.user.name,
    );
    const mail = {
      to: userClientEmail,
      subject: 'Nueva postutation',
      text: 'hola',
      template: template,
    };
    await this.emailService.sendPostulation(mail);
  }

  @OnEvent('postulation.closed')
  private async sendEmailPostulationClosed(payload: PostulationClosedEvent) {
    const postulationId = Object.values(payload)[0];

    const findPostulationById = await this.postulationRepository.findOne({
      where: {
        id: postulationId,
      },
      relations: ['user', 'job', 'job.client'],
    });

    const template = generatePostulationClosed(
      findPostulationById.job.client.name,
      findPostulationById.job,
      findPostulationById.user.name,
    );
    const mail = {
      to: findPostulationById.user.email,
      subject: 'Postulacion aceptada',
      text: '',
      template: template,
    };
    await this.emailService.sendPostulation(mail);
  }
}
