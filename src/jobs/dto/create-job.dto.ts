import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';
import { checkDecimal } from 'src/decorators/checkDecimal.decorator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @Validate(checkDecimal)
  base_price: number;

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

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
