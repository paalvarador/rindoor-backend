import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClosePostulation {
  @IsNotEmpty()
  @IsNotEmpty()
  @IsUUID()
  postulationId: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
