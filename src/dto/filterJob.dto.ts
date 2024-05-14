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

export class filterJobCategory extends PaginationQuery {
  @ApiPropertyOptional({
    type: [String],
    description: 'lista de categorias',
    example: ['Fontaneria', 'Electricidad', 'Construccion'],
  })
  @IsString({ each: true })
  @IsOptional()
  categories: string[];

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
}
