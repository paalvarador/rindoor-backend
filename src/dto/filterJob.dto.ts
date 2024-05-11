import { IsNotEmpty, IsString } from 'class-validator';

export class filterJobCategory {
  @IsString()
  @IsNotEmpty()
  category: string;
}
