import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles, UserStatus } from 'src/users/enums/user.enum';
import {
  DecodedIdTokenForEmailVerification,
  DecodedIdTokenForResetPassword,
  JwtPayload,
} from '../interfaces/decoded-id-token.interface';

@Injectable()
export class JWTTokenService {
  constructor(private readonly jwtService: JwtService) { }

  async generateAccessToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      uid: user.id,
      user: {
        id: user.id,
        fullName:
          user.fullName ??
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        isActive: user.isActive,
        verificationLinkGeneratedAt: user.verificationLinkGeneratedAt,
      },
    };

    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(userId: string | number): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async generateEmailVerificationToken(user: any): Promise<string> {
    const payload: DecodedIdTokenForEmailVerification = {
      uid: user.id,
      email: user.email,
      auth_time: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      sub: user.id,
      user: {
        id: user.id,
        fullName:
          user.fullName ??
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified ?? false,
        verificationLinkUsed: user.verificationLinkUsed ?? false,
        verificationLinkGeneratedAt: new Date(),
      },
    };

    // Let JwtService add exp automatically
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  async generatePasswordResetToken(user: any): Promise<string> {
    const payload: DecodedIdTokenForResetPassword = {
      uid: user.id,
      email: user.email,
      auth_time: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      sub: user.id,
      user: {
        id: user.id,
        fullName:
          user.fullName ??
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified ?? false,
        verificationLinkUsed: user.verificationLinkUsed ?? false,
        verificationLinkGeneratedAt: new Date(),
        resetPasswordLinkGeneratedAt: new Date(),
        resetPasswordLinkUsed: user.resetPasswordLinkUsed ?? false,
      },
    };

    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }


  /**
   * Verify and decode an email verification token.
   */
  async verifyEmailVerificationToken(
    token: string,
  ): Promise<DecodedIdTokenForEmailVerification> {
    try {
      return this.jwtService.verify<DecodedIdTokenForEmailVerification>(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Verification link has expired');
      }
      throw new UnauthorizedException('Invalid verification token');
    }
  }
}
