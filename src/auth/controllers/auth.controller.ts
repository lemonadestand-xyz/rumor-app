import { Body, Controller } from '@nestjs/common';
import {
  CreateResourceCombinedDecorators,
  PatchResourceCombinedDecorators,
  ReadResourceCombinedDecorators,
} from '../../common/decorators/routes-decorators.decorator';
import { SignUpRequestDto } from '../dto/request/signup-create-request.dto';
import { SignUpDataCreateModel } from '../models/signup-create.model';
import { AuthService } from '../services/auth.service';
import { SignUpResponseDto } from '../dto/responses/signup-response.dto';
import {
  UserIdToken,
  VerifyEmailToken,
} from '../../common/decorators/user-id-token.decorator';
import { VerifyEmailRequestDto } from '../dto/request/verify-email-create-request.dto';
import {
  DecodedIdToken,
  DecodedIdTokenForEmailVerification,
} from '../../common/interfaces/decoded-id-token.interface';
import { VerifyEmailResponseDto } from '../dto/responses/verify-email-response.dto';
import { UpdatePasswordRequestDto } from '../dto/request/update-password-request.dto';
import { UpdatePasswordResponseDto } from '../dto/responses/update-password-response.dto';
import { SignInRequestDto } from '../dto/request/signin-create-request.dto';
import { SignInDataCreateModel } from '../models/signin-create.model';
import { SignInResponseDto } from '../dto/responses/signin-response.dto';

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

  @ReadResourceCombinedDecorators({
    path: 'me',
    additionalErrors: ['badRequest', 'conflict'],
    // responseType: DataWithPaginationResponseDto,
  })
  public async getUserById(
    @UserIdToken() userIdToken: DecodedIdToken,
  ): Promise<any> {
    return userIdToken;
    // const favoriteChaletsByUserId =
    //   await this.favouriteChaletsService.favouriteChaletsByUserId(userIdToken.uid, paginationDto);
    // return DataWithPaginationResponseDto.fromModel(favoriteChaletsByUserId);
  }

  @PatchResourceCombinedDecorators({
    path: 'updatePassword',
    additionalErrors: ['badRequest', 'conflict'],
    responseType: UpdatePasswordResponseDto,
  })
  public async updateUserPassword(
    @VerifyEmailToken() userIdToken: DecodedIdToken,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    const updateUserPassword = await this.authService.updatePassword(
      userIdToken.uid,
      dto,
    );
    return UpdatePasswordResponseDto.fromModel(updateUserPassword);
  }
}
