import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class modifyPostulation implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request.body = {
      ...request.body,
      offered_price: Number(request.body.offered_price),
    };
    console.log(typeof request.body.offered_price);
    return next.handle();
  }
}
