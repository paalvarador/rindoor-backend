import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
//import { Role } from '../entities/Role.enum';
import { OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsValidProvince } from 'src/decorators/isValidProvince';
import { IsValidCountry } from 'src/decorators/isValidCountry';
import { IsValidCity } from 'src/decorators/isValidCity';
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
   * @example Argentina
   * @description Pais del usuario
   */
  @IsString()
  @IsNotEmpty()
  country: string;

  /**
   * @example Buenos Aires
   * @description nombre de la provincia del usuario
   */
  @IsString()
  @IsNotEmpty()
  province: string;

  // /**
  //  * @example 682
  //  * @description Id de la ciudad del usuario
  //  */
  // @IsNumber()
  // @IsNotEmpty()
  // @Min(1)
  // @Max(99999)
  // @IsValidCity('country', 'province', {
  //   message: 'Ciudad invalida',
  // })
  // city: string;

  /**
   * @example Buenos Aires
   * @description nombre de la ciudad del usuario
   */
  @IsString()
  @IsNotEmpty()
  city: string;

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

  /**
   * @example ['123e4567-e89b-12d3-a456-426614174000']
   * @description Categorias del usuario
   */
  @IsOptional()
  @IsArray()
  @Type(() => CategoryId)
  @IsDefined({ each: true })
  categories: CategoryId[];
}
