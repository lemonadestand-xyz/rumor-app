import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DecodeUserIdTokenInterceptor } from './decode-user-id-token.interceptor';

@Module({
  imports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: DecodeUserIdTokenInterceptor,
    },
  ],
})
export class TokenDecodeInterceptorModule {}
