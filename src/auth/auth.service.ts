import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    };

    const token = this.jwtService.sign(userPayload);

    return token;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const user = await this.userService.findByEmail(email);

    if (user) throw new BadRequestException('Usuario ya existe');

    const newUser = await this.userService.create(createUserDto);

    if (!newUser) throw new BadRequestException('Registro fallido');

    return newUser;
  }
}
