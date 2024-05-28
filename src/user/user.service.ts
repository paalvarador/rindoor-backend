import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationQuery } from 'src/dto/pagintation.dto';
import { Category } from 'src/category/entities/category.entity';
import { geocode } from 'src/utils/coords';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Postulation)
    private postulationRepository: Repository<Postulation>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto) throw new BadRequestException('Usuario es requerido');
    if (createUserDto.categories && Array.isArray(createUserDto.categories)) {
      await Promise.all(
        createUserDto.categories.map(async (category) => {
          const categoryDB = await this.categoryRepository.findOne({
            where: { id: category.id },
          });
          if (!categoryDB) throw new NotFoundException('Categoria no existe');
        }),
      );
    }

    const userDB = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userDB) throw new ConflictException('Usuario ya existe');
    const country = createUserDto.country;
    const province = createUserDto.province;
    const city = createUserDto.city;
    const address = createUserDto.address;

    const coords = await geocode(country, province, city, address);

    const userToSave = { ...createUserDto, coords: coords };

    const newUser = await this.userRepository.save(userToSave);
    return newUser;
  }

  async findAll(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 10;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find({
      relations: ['categories'],
    });

    const sliceUsers = users.slice(startIndex, endIndex);
    return sliceUsers;
  }

  async findByEmail(email: string) {
    const userDB = await this.userRepository.findOne({
      where: { email },
      relations: ['categories', 'postulations', 'jobsAsClient'],
    });

    if (!userDB) throw new NotFoundException('Usuario no encontrado');

    const postulationsDB = await Promise.all(
      userDB.postulations.map(async (postulation) => {
        const postulationDB = await this.postulationRepository.findOne({
          where: { id: postulation.id },
          relations: ['job'],
        });
        return postulationDB;
      }),
    );
    userDB.postulations = postulationsDB;

    const jobsAsClientDB = await Promise.all(
      userDB.jobsAsClient.map(async (job) => {
        const jobDB = await this.jobRepository.findOne({
          where: { id: job.id },
          relations: ['postulations'],
        });
        return jobDB;
      }),
    );
    userDB.jobsAsClient = jobsAsClientDB;
    return userDB;
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    return findUser;
  }

  async addCategory(id: string, categoryId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: { categories: true },
    });

    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    const categoryToAdd = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!categoryToAdd) throw new NotFoundException('Category no Existe');

    const idsCategories = foundUser.categories.map((category) => category.id);
    if (!idsCategories.includes(categoryToAdd.id)) {
      foundUser.categories.push(categoryToAdd);
      await this.userRepository.save(foundUser);
      return categoryToAdd;
    }
    return 'Usuario ya tiene esta categoria';
  }

  async update(id: string, updateCategoryDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.update(id, {
      ...updateCategoryDto,
    });
    return `Usuario actualizado`;
  }

  async remove(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.update({ id: id }, { isActive: false });

    return `Usuario Desactivado`;
  }

  async setSubscription(
    subscriptionId: string,
    customerId: string,
    emailUser: string,
    planId: string,
  ) {
    const user = await this.userRepository.findOneBy({ email: emailUser });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.update(
      { email: emailUser },
      {
        planId,
        customerId,
        subscriptionId,
      },
    );
  }

  async setSubscriptionId(
    subscriptionId: string,
    userEmail: string,
    planId: string,
    customerId: string,
  ) {
    const user = await this.findByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.update(user.id, {
      planId,
      customerId,
      subscriptionId,
    });
  }

  async banUser(id: string) {
    const findUser = await this.findOne(id);
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.update(findUser.id, { isActive: false });

    const updatedUser = await this.userRepository.findOne({
      where: { id: findUser.id },
    });

    return updatedUser;
  }

  async findByCustomerIdStripe(customerId: string) {
    const user = await this.userRepository.findOne({
      where: { customerId },
    });
    return user;
  }

  async addContact(id: string, contactId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const contact = await this.userRepository.findOne({
      where: { id: contactId },
    });
    if (!contact) throw new NotFoundException('Contacto no encontrado');

    if (user.role === contact.role)
      throw new BadRequestException(
        'No puedes agregar un contacto con el mismo rol',
      );

    const contacts = user.contacts.map((contact) => contact.id);
    if (!contacts.includes(contact.id)) {
      user.contacts.push(contact);
      await this.userRepository.save(user);
    }

    const userContact = await this.userRepository.findOne({
      where: { id: contactId },
      relations: ['contacts'],
    });
    const contactsContact = userContact.contacts.map((contact) => contact.id);
    if (!contactsContact.includes(user.id)) {
      userContact.contacts.push(user);
      await this.userRepository.save(userContact);
      return user;
    }
    return 'Usuario ya tiene este contacto';
  }
}
