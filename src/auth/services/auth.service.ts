import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDataCreateModel } from '../models/signup-create.model';
import { UsersRepository } from '../../common/database/users/repositories/user.repository';
import { JWTTokenService } from '../../common/jwtToken/jwtToken.service';
import { EmailService } from '../../emails/emails.service';
import { Logger } from 'nestjs-pino';
import {
  DecodedIdTokenForEmailVerification,
} from '../../common/interfaces/decoded-id-token.interface';
import {
  comparePasswordHash,
  hashPassword,
} from '../../common/utils/password-hash.util';
import { UpdatePasswordRequestDto } from '../dto/request/update-password-request.dto';
import { SignInDataCreateModel } from '../models/signin-create.model';
import { SignInReadModel } from '../models/signin-read.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtTokenService: JWTTokenService,
    private readonly logger: Logger,
    private readonly emailService: EmailService,
  ) {}

  private async generateTokens(user: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.jwtTokenService.generateAccessToken(user);
    const refreshToken = await this.jwtTokenService.generateRefreshToken(
      user.id,
    );
    return { accessToken, refreshToken };
  }

  async signUp(
    data: SignUpDataCreateModel,
  ): Promise<{ message: string; id: string }> {
    try {
      const created = await this.usersRepository.create(data);
      // Fetch fresh copy to ensure id and timestamps populated
      const user = await this.usersRepository.getById(created.id);
      if (!user) {
        throw new InternalServerErrorException('User not found after creation');
      }
      const accessToken =
        await this.jwtTokenService.generateEmailVerificationToken(user);
      this.emailService
        .sendVerifyEmailAddress(
          user.email,
          `${user.firstName ?? ''} ${user.lastName ?? ''}`,
          accessToken,
          user.id,
          user.email,
        )
        .then(() => this.logger.log(`Welcome email queued for ${user.email}`))
        .catch((err) =>
          this.logger.error(
            `Email send failed for ${user.email}: ${err.message}`,
          ),
        );

      return { message: 'User Created Successfully', id: user.id };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Sign Up failed', {
        cause: new Error(`Sign Up failed: ${error?.message}`),
      });
    }
  }

  async signIn(data: SignInDataCreateModel): Promise<SignInReadModel> {
    try {
      const { email, password } = data;
      const user = await this.usersRepository.getByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await comparePasswordHash(
        password,
        user.passwordHash,
      );

      if (!user.isActive) {
        throw new NotFoundException('Your account is not fully active');
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const tokens = await this.generateTokens(user);

      const response = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user?.id,
        isProfileCreated: user?.isProfileCreated,
        roles: user.roles,
        message: 'Successfully signed In',
      };
      return SignInReadModel.fromObject(response);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      this.logger.error(
        `❌ Sign in failed for ${data.email}: ${error.message}`,
      );
      throw new InternalServerErrorException('Sign in failed', {
        cause: new Error(`Error signing in: ${error?.message}`),
      });
    }
  }

  async resendEmailVerification(
    userId: string,
    email: string,
  ): Promise<{ message: string; id: string }> {
    try {
      const user = await this.usersRepository.getById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.isVerified) {
        throw new BadRequestException('User is already verified');
      }

      if (user.email !== email) {
        throw new BadRequestException('Email does not match our records');
      }
      const newToken =
      await this.jwtTokenService.generateEmailVerificationToken(user);
      await this.usersRepository.update(user.id, {
        verificationLinkGeneratedAt: new Date(),
        verificationLinkUsed: false,
      });

      await this.emailService.sendVerifyEmailAddress(
        user.email,
        `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        newToken,
        user.id,
        user.email,
      );

      this.logger.log(`Resent verification email to ${user.email}`);
      return { message: 'Verification email resent successfully', id: user.id };
    } catch (error) {
      this.logger.error(`Resend verification failed: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to resend verification email',
        {
          cause: new Error(error?.message),
        },
      );
    }
  }

  async verifyEmail(
    userIdToken: DecodedIdTokenForEmailVerification,
    userId: string,
  ): Promise<{ message: string; id: string }> {
    const { uid, exp, user } = userIdToken;

    try {
      if (uid !== userId) {
        throw new UnauthorizedException('Given data is incorrect');
      }
      if (!user.verificationLinkGeneratedAt) {
        throw new BadRequestException('Token missing generation timestamp');
      }

      const tokenIssuedAt = new Date(
        user.verificationLinkGeneratedAt,
      ).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - tokenIssuedAt) / 1000);

      if (elapsedSeconds > 5 * 60) {
        throw new BadRequestException(
          'Verification link has expired (5-minute limit)',
        );
      }

      const dbUser = await this.usersRepository.getById(userId);
      if (!dbUser) {
        throw new NotFoundException('User not found');
      }

      if (dbUser.verificationLinkUsed) {
        throw new ConflictException('Verification link has already been used');
      }

      if (dbUser.isVerified) {
        throw new ConflictException('User is already verified');
      }

      if (user?.email && dbUser.email !== user.email) {
        throw new UnauthorizedException(
          'Token email does not match the user email',
        );
      }

      await this.usersRepository.update(uid, {
        isVerified: true,
        verificationLinkUsed: true,
        verificationLinkUsedAt: new Date(),
      });

      // const updatedUser = await this.usersRepository.getById(userId);
      // const accessToken =
      //   await this.jwtTokenService.generateAccessToken(updatedUser);

      this.logger.log(`✅ User ${dbUser.email} verified successfully`);
      return { message: 'Email verified successfully', id: uid };
    } catch (error) {
      this.logger.error(`❌ Error verifying user: ${error.message}`);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // rethrow known errors
      }
      throw new InternalServerErrorException('Email verification failed', {
        cause: new Error(`Error verifying user: ${error?.message}`),
      });
    }
  }

  async setPassword(
    userId: string,
    dto: UpdatePasswordRequestDto,
  ): Promise<{ message: string; id: string }> {
    try {
      const user = await this.usersRepository.getById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.isVerified) {
        throw new BadRequestException('Your account is not verified');
      }
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      let hashedPassword: string;
      hashedPassword = await hashPassword(dto.password, 10);
      if (!hashedPassword) {
        throw new InternalServerErrorException('Failed to hash password');
      }

      await this.usersRepository.update(userId, {
        passwordHash: hashedPassword,
        isActive: true,
      });

      this.logger.log(
        `✅ Password updated successfully for user ${user.email}`,
      );
      return { message: 'Password updated successfully', id: userId };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Password update failed', {
        cause: new Error(`Error updating password: ${error?.message}`),
      });
    }
  }

  async forgetPassword(
    email: string,
  ): Promise<{ message: string; id: string }> {
    try {
      const user = await this.usersRepository.getByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isVerified) {
        throw new BadRequestException('Your account is not verified');
      }

      await this.usersRepository.update(user.id, {
        resetPasswordLinkGeneratedAt: new Date(),
        resetPasswordLinkUsed: false,
      });

      const updatedUser = await this.usersRepository.getById(user.id);

      const resetToken =
        await this.jwtTokenService.generatePasswordResetToken(updatedUser);

      this.emailService
        .sendPasswordResetEmail(
          user.email,
          `${user.firstName ?? ''} ${user.lastName ?? ''}`,
          resetToken,
          user.id,
        )
        .then(() =>
          this.logger.log(`Password reset email queued for ${user.email}`),
        )
        .catch((err) =>
          this.logger.error(
            `Password reset email send failed for ${user.email}: ${err.message}`,
          ),
        );

      return { message: 'Password reset link sent to your email', id: user.id };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `❌ Forget password failed for ${email}: ${error.message}`,
      );
      throw new InternalServerErrorException('Forget password failed', {
        cause: new Error(`Error in forget password: ${error?.message}`),
      });
    }
  }

  async resetPassword(
    userId: string,
    dto: UpdatePasswordRequestDto,
  ): Promise<{ message: string; id: string }> {
    try {
      const user = await this.usersRepository.getById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.isVerified) {
        throw new BadRequestException('Your account is not verified');
      }

      if (user.resetPasswordLinkUsed) {
        throw new BadRequestException('This token is already used');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      let hashedPassword: string;
      hashedPassword = await hashPassword(dto.password, 10);
      if (!hashedPassword) {
        throw new InternalServerErrorException('Failed to hash password');
      }

      await this.usersRepository.update(userId, {
        passwordHash: hashedPassword,
        resetPasswordLinkUsed: true,
      });

      this.logger.log(
        `✅ Password updated successfully for user ${user.email}`,
      );
      return { message: 'Password updated successfully', id: userId };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Password update failed', {
        cause: new Error(`Error updating password: ${error?.message}`),
      });
    }
  }
}
