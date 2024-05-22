import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/user/entities/User.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(Feedback) private feedRepository: Repository<Feedback>,
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto, receptorId) {
    const finJob = await this.jobRepository.findOne({
      where: { id: createFeedbackDto.jobId },
      relations: [
        'feedback',
        'feedback.author',
        'feedback.recipient',
        'feedback.job',
        'user',
      ],
    });

    if (finJob.status !== 'finished')
      throw new BadRequestException('Just can qualify if the Job is FINISHED');

    const existReceptor = finJob.feedback.some((f) =>
      f.recipient.some((r) => r.id === receptorId),
    );
    if (existReceptor)
      throw new ConflictException('receptor, solo puede recibir un comentario');

    const existsAuthor = finJob.feedback.some((f) =>
      f.author.some((a) => a.id === createFeedbackDto.authorId),
    );

    if (existsAuthor)
      throw new ConflictException('Autor, Solo puede comentar una vez');

    if (!finJob) throw new NotFoundException('JOB not found');

    const findReceptorUser = await this.userRepository.findOne({
      where: { id: receptorId },
    });
    if (!findReceptorUser)
      throw new NotFoundException('Feedback, user not found');

    const findAuthor = await this.userRepository.findOne({
      where: { id: createFeedbackDto.authorId },
    });
    if (!findAuthor) throw new NotFoundException('Feedback, Author not found');

    const newFeeback = {
      ...createFeedbackDto,
      recipient: [findReceptorUser],
      author: [findAuthor],
      job: finJob,
    };

    const newRating = (findReceptorUser.rating + newFeeback.rating) / 2;
    await this.userRepository.update(
      { id: findReceptorUser.id },
      { rating: newRating },
    );

    return await this.feedRepository.save(newFeeback);
  }

  async findAll() {
    return await this.feedRepository.find();
  }

  async findOne(id: string) {
    const findFeed = await this.feedRepository.findOne({ where: { id: id } });
    if (!findFeed) throw new NotFoundException('Feedback,not Found');

    return findFeed;
  }

  async remove(id: string) {
    const findFeed = await this.feedRepository.delete({ id: id });
    if (!findFeed) throw new NotFoundException('Feedback,not Found');

    return findFeed;
  }
}
