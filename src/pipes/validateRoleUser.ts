import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class validateRoleUser implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.role === 'ADMIN') {
      throw new NotAcceptableException("Role 'ADMIN' is not allowed");
    }
    return value;
  }
}
