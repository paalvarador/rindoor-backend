import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubDto {
  /**
   * @example 'price_1PG4dfCB2wIFzJht7bjOC2lV'
   * @description ID del plan
   */
  @IsString()
  @IsNotEmpty()
  planId: string;

  /**
   * @example 'f7b9b1b0-0b3b-4b3b-8b3b-0b3b3b3b3b3b'
   * @description ID del usuario
   */
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
