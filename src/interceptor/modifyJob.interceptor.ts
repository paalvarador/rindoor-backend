import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class modifyJob implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request.body = {
      ...request.body,
      base_price: Number(request.body.base_price),
    };
    console.log(typeof request.body.base_price);
    return next.handle();
  }
}
