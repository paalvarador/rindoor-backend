import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from '../entities/Role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  @IsString()
  @IsNotEmpty()
  role: Role.CLIENT | Role.ADMIN;
}
