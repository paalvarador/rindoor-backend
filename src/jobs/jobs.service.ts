import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';
import { FileUpload } from 'src/cloudinary/FileUpload';
import { filterJobCategory } from 'src/dto/filterJob.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import { body } from 'src/utils/body';
import { FinishJob } from './dto/finishJob.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private fileUploadService: FileUpload,
    private emailService: EmailService,
  ) {}

  async create(createJobDto: CreateJobDto, file) {
    const foundUser = await this.userRepository.findOne({
      where: { id: createJobDto.userId },
    });
    if (!foundUser) throw new NotFoundException('Usuario not found');
    if (foundUser.role !== 'CLIENT')
      throw new UnauthorizedException('Accesso solo para los Clientes');

    const foundCategory = await this.categoryRepository.findOne({
      where: { id: createJobDto.categoryId },
    });
    if (!foundCategory) throw new NotFoundException('Categoria no encontrada');

    let imgUrl: string;
    if (file) {
      const imgUpload = await this.fileUploadService.uploadImg(file);
      if (!imgUpload) {
        throw new HttpException(
          'Error al subir la imagen',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      imgUrl = imgUpload.url;
    }

    const newJob = {
      ...createJobDto,
      category: foundCategory,
      user: foundUser,
      img: imgUrl,
    };
    return await this.jobRepository.save(newJob);
  }

  async findAll(filter?: filterJobCategory) {
    const { page, limit, categories, minPrice, maxPrice } = filter;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;
    let defaultCategories = categories || [];

    if (Array.isArray(categories)) {
      defaultCategories = categories;
    } else if (categories) {
      if (typeof categories === 'string') {
        defaultCategories = [categories];
      } else if (categories) {
        defaultCategories = [categories];
      }
    }

    defaultCategories = defaultCategories.map((category) =>
      category.trim().toLowerCase().normalize(),
    );

    const defaultMinPrice = minPrice || 0;
    const defaultMaxPrice = maxPrice || 999999999.99;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const jobs = await this.jobRepository.find({
      relations: { category: true, user: true },
    });

    const filterJobs = jobs.filter(
      (job) =>
        job.base_price >= defaultMinPrice && job.base_price <= defaultMaxPrice,
    );

    const filterCategories = categories
      ? filterJobs.filter((job) =>
          defaultCategories.includes(
            job.category.name.toLowerCase().trim().normalize(),
          ),
        )
      : filterJobs;
    const sliceJobs = filterCategories.slice(startIndex, endIndex);
    return sliceJobs;
    // const countryJobs = !filter.country
    //   ? sliceJobs
    //   : sliceJobs.filter((job) => job.user.country === filter.country);

    // const stateJobs = !filter.province
    //   ? countryJobs
    //   : countryJobs.filter((job) => job.user.province === filter.province);
    // const cityJobs = !filter.city
    //   ? stateJobs
    //   : stateJobs.filter((job) => job.user.city === filter.city);

    // filter.name = filter.name && Number.parseInt(filter.name.toString());
    // const sortedJobsByName =
    //   filter.province === undefined
    //     ? cityJobs
    //     : filter.name === 0
    //       ? cityJobs.sort((a, b) => {
    //           const nameA = a.name.toUpperCase();
    //           const nameB = b.name.toUpperCase();
    //           return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    //         })
    //       : cityJobs.sort((a, b) => {
    //           const nameA = a.name.toUpperCase();
    //           const nameB = b.name.toUpperCase();
    //           return nameB < nameA ? -1 : nameB > nameA ? 1 : 0;
    //         });

    // filter.latest = filter.latest && Number.parseInt(filter.latest.toString());
    // const sortedJobsByDate =
    //   filter.latest === undefined
    //     ? sortedJobsByName
    //     : filter.latest === 0
    //       ? sortedJobsByName.sort((a, b) => {
    //           const dateA = new Date(a.created_at).getTime();
    //           const dateB = new Date(b.created_at).getTime();
    //           return dateA - dateB;
    //         })
    //       : sortedJobsByName.sort((a, b) => {
    //           const dateA = new Date(a.created_at).getTime();
    //           const dateB = new Date(b.created_at).getTime();
    //           return dateB - dateA;
    //         });
    // filter.prices = filter.prices && Number.parseInt(filter.prices.toString());
    // const sortedJobsByPrice =
    //   filter.prices === undefined
    //     ? sortedJobsByDate
    //     : filter.prices === 0
    //       ? sortedJobsByDate.sort((a, b) => a.base_price - b.base_price)
    //       : sortedJobsByDate.sort((a, b) => b.base_price - a.base_price);

    // return sortedJobsByPrice;
  }

  async findJobByClient(clientId: string) {
    const findJob = await this.jobRepository.find({
      relations: { user: true },
    });

    const filterByUser = findJob.filter((job) => job.user.id === clientId);
    if (!filterByUser)
      throw new NotFoundException('User does not have any jobs associated');

    return filterByUser;
  }

  //*Professional
  async finishJob(finishJob: FinishJob) {
    const findJob = await this.jobRepository.findOne({
      where: { id: finishJob.jobId },
      relations: ['postulations', 'postulations.user'],
    });
    if (!findJob) throw new NotFoundException('Job does not exist');

    const findFinishJob = findJob.postulations.find(
      (p) => p.user.id === finishJob.userId,
    );
    if (!findFinishJob)
      throw new NotFoundException(
        'Job does not have relationship with userProfessional',
      );

    await this.jobRepository.update(
      { id: findJob.id },
      { status: JobStatus.Finished },
    );

    return 'Job finished successfully by professional';
  }

  async findOne(id: string) {
    const findJob = await this.jobRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!findJob) throw new NotFoundException('Trabajo no encontrado');

    return findJob;
  }

  async remove(id: string) {
    const findJob = await this.jobRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!findJob) throw new NotFoundException('Trabajo no encontrado');

    if (findJob.user.role !== 'CLIENT')
      throw new BadRequestException('Action just for Clients');

    await this.jobRepository.remove(findJob);
    return `Trabajo con id: ${id} eliminado`;
  }

  //@Cron('*/20 * * * * *')
  @Cron('0 8 * * 1-5')
  async handleCron() {
    const jobs = await this.jobRepository.find({
      relations: ['user', 'category'],
    });
    const users = await this.userRepository.find({
      relations: { categories: true },
    });

    const userProfessional = users.filter(
      (user) => user.role === 'PROFESSIONAL',
    );
    const categories = jobs.map((job) => job.category.name);

    const userCategoriesNames = [];
    userProfessional.forEach((user) =>
      user.categories.forEach((category) =>
        userCategoriesNames.push(category.name),
      ),
    );

    const proffesionalMailing = userProfessional.filter((user) =>
      user.categories.some((category) => categories.includes(category.name)),
    );

    proffesionalMailing.forEach((user) => {
      const sendJob = jobs.filter((job) =>
        userCategoriesNames.includes(job.category.name),
      );

      const jobsToSend = sendJob.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });

      const template = body(user.email, 'Trabajos Nuevos', jobsToSend);

      const mail = {
        to: user.email,
        subject: 'Trabajos Nuevos Publicados',
        text: 'Nuevos trabajos',
        template: template,
      };

      this.emailService.sendPostulation(mail);
    });
  }
}
