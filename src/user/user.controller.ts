import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './category.service';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    const usersDB = await this.userService.findAll();
    return usersDB;
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get('/:id')
  async findOne(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Put('/:id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<string> {
    const deletedUser = await this.userService.remove(id);
    return deletedUser;
  }
}
