import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsNumber, Max, Min } from 'class-validator';
import { Role } from '../entities/Role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * @example 'John Doe'
   * @description Name of the user
   */
  name?: string;

  /**
   * @example 'john.doe@example.com'
   * @description Email of the user
   */
  email?: string;

  /**
   * @example 5.2
   * @description Rating of the user
   */
  @IsNumber()
  @Min(1.0)
  @Max(10.0)
  rating: number;
}
