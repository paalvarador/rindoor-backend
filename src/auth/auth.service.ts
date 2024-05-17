import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './user.register.event';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { Repository } from 'typeorm';
import { bodyRegister } from 'src/utils/bodyRegister';
import { bodyLogin } from 'src/utils/bodyLogin';

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

    const userPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      subcriptionId: user.subscriptionId,
      categories: user.categories,
    };

    const token = this.jwtService.sign(userPayload);

    this.eventEmitter.emit('user.login', new UserCreatedEvent(user.id));

    return token;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    //console.log(createUserDto, '******createdto******');
    const user = await this.userService.findByEmail(email);

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
