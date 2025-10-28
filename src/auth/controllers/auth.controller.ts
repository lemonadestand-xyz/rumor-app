import { Body, Controller } from '@nestjs/common';
import {
  CreateResourceCombinedDecorators,
  PatchResourceCombinedDecorators,
} from '../../common/decorators/routes-decorators.decorator';
import { SignUpRequestDto } from '../dto/request/signup-create-request.dto';
import { SignUpDataCreateModel } from '../models/signup-create.model';
import { AuthService } from '../services/auth.service';
import { SignUpResponseDto } from '../dto/responses/signup-response.dto';
import {
  ResetPasswordToken,
  VerifyEmailToken,
} from '../../common/decorators/user-id-token.decorator';
import { VerifyEmailRequestDto } from '../dto/request/verify-email-create-request.dto';
import {
  DecodedIdToken,
  DecodedIdTokenForEmailVerification,
  DecodedIdTokenForResetPassword,
} from '../../common/interfaces/decoded-id-token.interface';
import { VerifyEmailResponseDto } from '../dto/responses/verify-email-response.dto';
import { UpdatePasswordRequestDto } from '../dto/request/update-password-request.dto';
import { UpdatePasswordResponseDto } from '../dto/responses/update-password-response.dto';
import { SignInRequestDto } from '../dto/request/signin-create-request.dto';
import { SignInDataCreateModel } from '../models/signin-create.model';
import { SignInResponseDto } from '../dto/responses/signin-response.dto';
import { ForgetPasswordRequestDto } from '../dto/request/forget-password-request.dto';
import { ResendVerifyEmailResponseDto } from '../dto/responses/resend-verify-email-response.dto';
import { ResendVerifyEmailRequestDto } from '../dto/request/resend-verify-email-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @CreateResourceCombinedDecorators({
    path: 'signup',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: SignUpResponseDto,
    public: true,
  })
  public async signUp(
    @Body() dto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const model = SignUpDataCreateModel.fromDto(dto);
    const user = await this.authService.signUp(model);
    return SignUpResponseDto.fromModel(user);
  }

  @CreateResourceCombinedDecorators({
    path: 'signin',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: SignInResponseDto,
    public: true,
  })
  public async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const model = SignInDataCreateModel.fromDto(dto);
    const user = await this.authService.signIn(model);
    return SignInResponseDto.fromModel(user);
  }

  @CreateResourceCombinedDecorators({
    path: 'verifyEmail',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: VerifyEmailResponseDto,
  })
  public async verifyEmail(
    @Body() dto: VerifyEmailRequestDto,
    @VerifyEmailToken() token: DecodedIdTokenForEmailVerification,
  ): Promise<VerifyEmailResponseDto> {
    const user = await this.authService.verifyEmail(token, dto.userId);
    return VerifyEmailResponseDto.fromModel(user);
  }
  @CreateResourceCombinedDecorators({
    path: 'resendVerifyEmail',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: ResendVerifyEmailResponseDto,
  })
  public async resendVerifyEmail(
    @Body() dto: ResendVerifyEmailRequestDto,
    @VerifyEmailToken() token: DecodedIdTokenForEmailVerification,
  ): Promise<ResendVerifyEmailResponseDto> {
    const user = await this.authService.resendEmailVerification(token.uid, dto.email);
    return ResendVerifyEmailResponseDto.fromModel(user);
  }

  @PatchResourceCombinedDecorators({
    path: 'setPassword',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: UpdatePasswordResponseDto,
  })
  public async setPassword(
    @VerifyEmailToken() userIdToken: DecodedIdToken,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const setUserPassword = await this.authService.setPassword(
      userIdToken.uid,
      dto,
    );
    return UpdatePasswordResponseDto.fromModel(setUserPassword);
  }

  @CreateResourceCombinedDecorators({
    path: 'forgetPassword',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: UpdatePasswordResponseDto,
    public: true,
  })
  public async forgetPassword(
    @Body() dto: ForgetPasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const updateUserPassword = await this.authService.forgetPassword(dto.email);
    return UpdatePasswordResponseDto.fromModel(updateUserPassword);
  }

  @PatchResourceCombinedDecorators({
    path: 'resetPassword',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: UpdatePasswordResponseDto,
  })
  public async updateUserPassword(
    @ResetPasswordToken() userIdToken: DecodedIdTokenForResetPassword,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const updateUserPassword = await this.authService.resetPassword(
      userIdToken.uid,
      dto,
    );
    return UpdatePasswordResponseDto.fromModel(updateUserPassword);
  }
}
