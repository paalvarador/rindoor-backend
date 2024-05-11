import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Role } from '../entities/Role.enum';

export class CreateUserDto {
  /**
   * @example 'Maria'
   * @description First name of the user
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  /**
   * @example 'Perez'
   * @description Last name of the user
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  /**
   * @example 'maria@gmail.com'
   * @description Email of the user
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example '4023215432'
   * @description Phone number of the user
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;

  /**
   * @example 'Calle 12B # 12-12'
   * @description Address of the user
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  /**
   * @example 'CLIENT'
   * @description Role of the user
   * @enum {Role}
   */
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role.CLIENT | Role.PROFESSIONAL;
}
