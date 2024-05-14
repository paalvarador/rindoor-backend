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
    };

    const token = this.jwtService.sign(userPayload);

    return token;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

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

    const mail = {
      to: userId.email,
      subject: 'hola',
      text: 'registro ok',
    };
    await this.emailService.sendMail(mail);
  }
}
