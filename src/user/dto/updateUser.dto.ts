import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  isString,
} from 'class-validator';
import { Role } from '../entities/Role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * @example 'John Doe'
   * @description Name of the user
   */
  @IsOptional()
  name?: string;

  /**
   * @example 'john.doe@example.com'
   * @description Email of the user
   */
  @IsOptional()
  email?: string;

  /**
   * @example 5.2
   * @description Rating of the user
   */
  @IsOptional()
  @IsNumber()
  @Min(1.0)
  @Max(10.0)
  rating?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
