import {
  IsNotEmpty,
  IsPositive,
  IsString,
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

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  category: string;
}
