import { IsNotEmpty, IsUUID } from 'class-validator';

export class FinishJob {
  @IsNotEmpty()
  @IsUUID()
  jobId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
