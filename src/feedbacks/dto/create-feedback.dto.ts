import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  jobId: string;

  authorId: string;
}
