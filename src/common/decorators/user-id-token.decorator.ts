import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { DecodedIdToken } from '../interfaces/decoded-id-token.interface';

export const UserIdToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdToken => {
    const request = context.switchToHttp().getRequest();

    if (!request.decodedIdToken) {
      throw new UnauthorizedException('No decoded token found');
    }

    if (!request.decodedIdToken.user.is_verified) {
      throw new UnauthorizedException('Your account is not verified');
    }
    if (!request.decodedIdToken.user.is_active) {
      throw new UnauthorizedException('Your account is not fully active');
    }
    return request.decodedIdToken;
  },
);

export const VerifyEmailToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdToken => {
    const request = context.switchToHttp().getRequest();

    if (!request.decodedIdToken) {
      throw new UnauthorizedException('No decoded token found');
    }

    return request.decodedIdToken;
  },
);
