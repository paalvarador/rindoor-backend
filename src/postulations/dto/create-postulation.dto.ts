import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { checkDecimal } from 'src/decorators/checkDecimal.decorator';

export class CreatePostulationDto {
  /**
   * @example 'Reparar Nevera'
   * @description 'Mensaje a cliente'
   */
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * @example '20.23'
   * @description Precio ofrecido del trabajo
   */
  @IsNotEmpty()
  @IsPositive()
  @Validate(checkDecimal)
  offered_price: number;

  /**
   * @example '18908870-475e-42e1-9620-588c38221377'
   * @description ID de user
   */
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  /**
   * @example '18908870-475e-42e1-9620-588c38221377'
   * @description ID de job
   */
  @IsNotEmpty()
  @IsUUID()
  jobId: string;
}
