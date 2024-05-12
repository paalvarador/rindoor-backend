import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class minSizeFile implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) return value;

    const minSize = 5000;

    if (value.size < minSize) {
      throw new BadRequestException('Archivo debe ser mayor a 5Kb');
    }
    return value;
  }
}
