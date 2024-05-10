import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  /**
   * @example 'Electricidad'
   * @description Nombre de la categoria
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  /**
   * @example 'Esta categoría implica servicios relacionados con la instalación, mantenimiento y reparación de sistemas eléctricos. Esto puede incluir la instalación de tomas de corriente, interruptores, iluminación, cableado eléctrico, así como la solución de problemas y la reparación de cortocircuitos.'
   * @description Descripcion del tipo de categoria
   */
  @IsString()
  @IsNotEmpty()
  description: string;
}
