import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AddCategoryUserDto {
  /**
   * @example 'f7b9f1b0-7b8b-4b7b-8b7b-7b8b7b8b7b8b'
   */
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;
}