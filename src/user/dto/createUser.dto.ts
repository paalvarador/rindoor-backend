import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
//import { Role } from '../entities/Role.enum';
import { OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export enum Role {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}

class CategoryId {
  @IsUUID()
  id: string;
}

export class CreateUserDto {
  /**
   * @example 'Maria Perez'
   * @description Last name of the user
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

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
  @Length(10)
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;

  /**
   * @example 'Argentina'
   * @description Country
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  country: string;

  /**
   * @example 'Buenos Aires'
   * @description Provincia
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  providence: string;

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
   * @default 'CLIENT'
   */
  @IsString()
  @IsNotEmpty()
  role: Role.CLIENT | Role.PROFESSIONAL;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryId)
  categories: CategoryId[];
}
