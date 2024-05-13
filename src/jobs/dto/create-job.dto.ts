import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { checkDecimal } from 'src/decorators/checkDecimal.decorator';

export class CreateJobDto {
  /**
   * @example 'Limpiar la casa 3'
   * @description Nombre del trabajo a realizar
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * @example 'Descripcion del trabajo'
   * @description Detalles del trabajo
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * @example '20.23'
   * @description Precio Base del trabajo
   */
  @IsNotEmpty()
  @IsPositive()
  @Validate(checkDecimal)
  base_price: number;

  /**
   * @example "36fda476-60ba-4da8-ae02-c9c1d9c3abf8"
   * @description ID de categoria
   */
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  /**
   * @example '18908870-475e-42e1-9620-588c38221377'
   * @description ID de user
   */
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
