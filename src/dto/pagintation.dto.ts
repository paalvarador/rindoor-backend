import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQuery {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'Cantidad de elementos a mostrar',
  })
  limit?: number = 10;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'Pagina actual',
  })
  page?: number = 1;
}
