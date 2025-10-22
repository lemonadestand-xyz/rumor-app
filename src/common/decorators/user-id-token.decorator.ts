import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { DecodedIdToken, DecodedIdTokenForResetPassword } from '../interfaces/decoded-id-token.interface';

export const UserIdToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdToken => {
    const request = context.switchToHttp().getRequest();

    if (!request.decodedIdToken) {
      throw new UnauthorizedException('No decoded token found');
    }

    if (!request.decodedIdToken.user.isVerified) {
      throw new UnauthorizedException('Your account is not verified');
    }
    if (!request.decodedIdToken.user.isActive) {
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

export const ResetPasswordToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdTokenForResetPassword => {
    const request = context.switchToHttp().getRequest();

    if (!request.decodedIdToken) {
      throw new UnauthorizedException('No decoded token found');
    }
    const generatedAt = request.decodedIdToken.user.resetPasswordLinkGeneratedAt;
    if (!generatedAt) {
      throw new UnauthorizedException('Invalid token');
    }

    const now = new Date();
    const generatedDate = new Date(generatedAt);
    const fiveMinutesInMs = 5 * 60 * 1000;

    if (now.getTime() - generatedDate.getTime() > fiveMinutesInMs) {
      throw new UnauthorizedException('Token has expired');
    }

    if (request.decodedIdToken.user.resetPasswordLinkUsed) {
      throw new UnauthorizedException('This token is already used');
    }

    return request.decodedIdToken;
  },
);
