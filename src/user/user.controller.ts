import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  alreadyExistsEmail,
  exampleCreatedUser,
} from './swaggerExamples/User.swagger';
import { PaginationQuery } from 'src/dto/pagintation.dto';

@Controller('users')
@ApiTags('users')
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    example: {
      statusCode: 500,
      message: 'Internal server error',
    },
  },
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'The records have been successfully found.',
    schema: {
      example: [exampleCreatedUser],
    },
  })
  @Get()
  async findAll(@Query() pagination?: PaginationQuery): Promise<User[]> {
    const usersDB = await this.userService.findAll(pagination);
    return usersDB;
  }

  @ApiResponse({
    status: 201,
    description: 'The record  has been successfully created.',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or Email already exists.',
    schema: {
      example: {
        'Validation failed': {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
        'Email already exists': {
          statusCode: 400,
          message: ['email already exists'],
          error: 'Bad Request',
        },
      },
    },
  })
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiNotFoundResponse({ schema: { example: { message: 'User not found' } } })
  @Get('/:id')
  async findOne(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or Email already exists.',
    schema: {
      example: {
        'Validation failed': {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
        'Email already exists': {
          statusCode: 400,
          message: ['email already exists'],
          error: 'Bad Request',
        },
      },
    },
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  @Delete('/:id')
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
      },
    },
  })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<string> {
    const deletedUser = await this.userService.remove(id);
    return deletedUser;
  }
}
