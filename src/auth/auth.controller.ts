import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    const { email } = loginAuthDto;
    const response = await this.authService.signIn(email);

    if (!response) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Login failed' });
    }

    res.status(HttpStatus.OK).json({ message: 'Login successful', response });
  }

  @Post('signup')
  async singup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.authService.signUp(createUserDto);

    if (!response) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Then user can not be signed up' });
    }

    res.status(HttpStatus.OK).json({ message: 'User signed up', response });
  }
}
