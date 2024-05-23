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
import { IsValidCity } from 'src/decorators/isValidCity';
import { IsValidProvince } from 'src/decorators/isValidProvince';
import { IsValidCountry } from 'src/decorators/isValidCountry';

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

  // /**
  //  * @example 11
  //  * @description Pais del usuario
  //  */
  // @IsOptional()
  // @IsNumber()
  // @Min(1)
  // @Max(99999)
  // @IsValidCountry({
  //   message: 'Pais invalido',
  // })
  @IsString()
  @IsOptional()
  country: string;

  // /**
  //  * @example 3656
  //  * @description id de la provincia del usuario
  //  */
  // @IsOptional()
  // @IsNumber()
  // @Min(1)
  // @Max(99999)
  // @IsValidProvince('country', {
  //   message: 'Provincia invalida',
  // })
  @IsString()
  @IsOptional()
  province: string;

  // /**
  //  * @example 682
  //  * @description Id de la ciudad del usuario
  //  */
  // @IsOptional()
  // @IsNumber()
  // @Min(1)
  // @Max(99999)
  // @IsValidCity('country', 'province', {
  //   message: 'Ciudad invalida',
  // })
  // city: number;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
