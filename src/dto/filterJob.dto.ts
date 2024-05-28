import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { PaginationQuery } from './pagintation.dto';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidCity } from 'src/decorators/isValidCity';
import { IsValidProvince } from 'src/decorators/isValidProvince';
import { IsValidCountry } from 'src/decorators/isValidCountry';

export class filterJobCategory extends PaginationQuery {
  @ApiPropertyOptional({
    type: [String],
    description: 'lista de categorias',
    example: ['Fontaneria', 'Electricidad', 'Construccion'],
  })
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  /**
   * @example 0.00
   * @description precio minimo
   */
  @IsNumber()
  @IsOptional()
  @Min(0.0)
  @Transform(({ value }) => Number(value))
  minPrice?: number;

  /**
   * @example 10000.00
   * @description precio maximo
   */
  @IsNumber()
  @IsOptional()
  @Max(999999999.99)
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

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
  // @Transform(({ value }) => Number(value))
  // country: number;

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
  // @Transform(({ value }) => Number(value))
  // province: number;

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
  // @Transform(({ value }) => Number(value))
  // city: number;

  /**
   * @example 1
   * @description Orderna de forma ascendente(0) o descendente(1)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Transform(({ value }) => Number(value))
  name?: number;

  /**
   * @example 1
   * @description Orderna mayores precios(0) o menores precios(1)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Transform(({ value }) => Number(value))
  prices?: number;

  /**
   * @example 1
   * @description Orderna los trabajos mas recientes(0) o los mas antiguos(1)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Transform(({ value }) => Number(value))
  latest?: number;
}
