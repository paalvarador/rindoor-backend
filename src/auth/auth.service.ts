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

    console.log(`user: ${user}`);

    if (!user) throw new BadRequestException('User not found');

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

    if (user) throw new BadRequestException('Email already exists');

    const newUser = await this.userService.create(createUserDto);

    if (!newUser) throw new BadRequestException('Could not create user');

    return newUser;
  }
}
