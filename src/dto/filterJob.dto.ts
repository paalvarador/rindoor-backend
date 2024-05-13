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

export class filterJobCategory extends PaginationQuery {
  /**
   * @example ['Fontaneria', 'Electricidad', 'Carpinteria']
   */
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsOptional()
  categories: string[];

  /**
   * @example 100.00
   */
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  minPrice?: number;

  /**
   * @example 10000.00
   */
  @IsNumber()
  @IsOptional()
  @Max(999999999.99)
  @Transform(({ value }) => Number(value))
  maxPrice?: number;
}
