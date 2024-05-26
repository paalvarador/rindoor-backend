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
import { geocode } from 'src/utils/coords';

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
    if (foundUser.isActive === false)
      return { message: 'usuario baneado', user: foundUser };
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
    const country = createJobDto.country;
    const province = createJobDto.province;
    const city = createJobDto.city;
    const address = createJobDto.address;

    const coords = await geocode(country, province, city, address);

    const newJob = {
      ...createJobDto,
      category: foundCategory,
      user: foundUser,
      img: imgUrl,
      coords: coords,
    };
    return await this.jobRepository.save(newJob);
  }

  async findAll(filter?: filterJobCategory) {
    const {
      page,
      limit,
      categories,
      minPrice,
      maxPrice,
      name,
      latest,
      prices,
    } = filter || {};
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;
    let defaultCategories = categories || [];

    if (typeof categories === 'string') {
      defaultCategories = [categories];
    } else if (Array.isArray(categories)) {
      defaultCategories = categories;
    }

    defaultCategories = defaultCategories.map((category) =>
      category.trim().toLowerCase().normalize(),
    );

    const defaultMinPrice = minPrice ?? 0;
    const defaultMaxPrice = maxPrice ?? 999999999.99;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const jobs = await this.jobRepository.find({
      relations: { category: true, user: true },
    });

    let filterJobs = jobs.filter(
      (job) =>
        job.base_price >= defaultMinPrice && job.base_price <= defaultMaxPrice,
    );

    if (defaultCategories.length > 0) {
      filterJobs = filterJobs.filter((job) =>
        defaultCategories.includes(
          job.category.name.toLowerCase().trim().normalize(),
        ),
      );
    }

    const parsedName =
      name !== undefined ? Number.parseInt(name.toString()) : undefined;
    const parsedLatest =
      latest !== undefined ? Number.parseInt(latest.toString()) : undefined;
    const parsedPrices =
      prices !== undefined ? Number.parseInt(prices.toString()) : undefined;

    filterJobs = filterJobs.sort((a, b) => {
      if (parsedName !== undefined) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        const comparison = nameA.localeCompare(nameB);
        if (comparison !== 0) {
          return parsedName === 0 ? comparison : -comparison;
        }
      }

      if (parsedLatest !== undefined) {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        const comparison = dateA - dateB;
        if (comparison !== 0) {
          return parsedLatest === 0 ? comparison : -comparison;
        }
      }

      if (parsedPrices !== undefined) {
        const comparison = a.base_price - b.base_price;
        if (comparison !== 0) {
          return parsedPrices === 0 ? comparison : -comparison;
        }
      }

      return 0;
    });

    const paginatedJobs = filterJobs.slice(startIndex, endIndex);
    return paginatedJobs;
    // const sliceJobs = filterCategories.slice(startIndex, endIndex);
    // return sliceJobs;
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
    //   filter.name !== undefined
    //     ? filterCategories.slice().sort((a, b) => {
    //         const nameA = a.name.toUpperCase();
    //         const nameB = b.name.toUpperCase();
    //         return filter.name === 0
    //           ? nameA.localeCompare(nameB) // Ascendente
    //           : nameB.localeCompare(nameA); // Descendente
    //       })
    //     : filterCategories;

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

    // const sliceJob = sortedJobsByPrice.slice(startIndex, endIndex);
    // return sliceJob
  }

  async findJobByClient(clientId: string) {
    const findJob = await this.jobRepository.find({
      relations: { category: true },
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
      relations: [
        'category',
        'user',
        'postulations',
        'postulations.user',
        'postulations.user.categories',
      ],
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
