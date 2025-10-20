import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class DecodeUserIdTokenInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (!req.decodedIdToken) {
      this.logger.error('Token validation failed');
      throw new UnauthorizedException();
    }
    return next.handle();
  }
}
