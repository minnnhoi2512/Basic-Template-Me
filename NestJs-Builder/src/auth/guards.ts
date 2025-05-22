import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class Guards implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context);
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    return authHeader === '1234567890';
  }
}
