import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './user.register.event';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { NoConnectionForRepositoryError, Repository } from 'typeorm';
import { bodyRegister } from 'src/utils/bodyRegister';
import { bodyLogin } from 'src/utils/bodyLogin';
import { first } from 'rxjs';
import {
  findCity,
  findCountryName,
  findState,
} from 'src/ubication/utils/fsUtil.util';
import { Role } from 'src/user/entities/Role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signIn(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.isActive === false)
      return { message: 'usuario baneado', user: user };
    // const userCountryName = await findCountryName(user.country);
    // const userState = await findState(user.province);
    // const userCity = await findCity(user.city);

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      subcriptionId: user.subscriptionId,
      categories: JSON.stringify(
        user.categories.map((category) => category.id),
      ),
      name: user.name,
      phone: user.phone,
      country: user.country,
      province: user.province,
      address: user.address,
      rating: user.rating,
      coord: user.coords
    };
    if (user.role === Role.CLIENT) {
      userPayload['jobs'] = JSON.stringify(user.jobsAsClient);
    }
    if (user.role === Role.PROFESSIONAL) {
      userPayload['postulations'] = JSON.stringify(user.postulations);
    }

    const token = this.jwtService.sign(userPayload);

    this.eventEmitter.emit('user.login', new UserCreatedEvent(user.id));

    return token;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userRepository.findOneBy({ email: email });

    if (user) throw new BadRequestException('Usuario ya existe');

    const newUser = await this.userService.create(createUserDto);
    const { id } = newUser;

    if (!newUser) throw new BadRequestException('Registro fallido');

    this.eventEmitter.emit('user.created', new UserCreatedEvent(id));

    return newUser;
  }

  @OnEvent('user.created')
  private async sendEmail(payload: UserCreatedEvent) {
    const userId = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    const template = bodyRegister(userId.email, 'Bienvenido a RinDoor', userId);

    const mail = {
      to: userId.email,
      subject: 'Bienvenido a RinDoor',
      text: 'Has Iniciado Sesion en RinDoor',
      template: template,
    };
    await this.emailService.sendPostulation(mail);
  }

  @OnEvent('user.login')
  private async sendEmailLogin(payload: UserCreatedEvent) {
    const userId = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    const template = bodyLogin(userId.email, 'Bienvenido a RinDoor', userId);

    const mail = {
      to: userId.email,
      subject: 'Bienvenido a RinDoor',
      text: 'Login Exitoso',
      template: template,
    };
    await this.emailService.sendPostulation(mail);
  }
}
