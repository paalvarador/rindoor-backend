import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class modifyUserCreate implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (Array.isArray(request.body.categories)) {
      request.body.categories = request.body.categories.map((c) => ({
        id: c,
      }));
    }
    return next.handle();
  }
}
