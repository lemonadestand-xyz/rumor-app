import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';
import { SignInReadModel } from '../../models/signin-read.model';
import { UserRoles } from '../../../users/enums/user.enum';

export class SignInResponseDto {
  static fromModel(model: SignInReadModel): IPublic<SignInResponseDto> {
    return {
      message: model.message,
      id: model.userId,
      roles: model.roles,
      accessToken: model.accessToken,
      refreshToken: model.refreshToken,
    };
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  roles: UserRoles[];

  @ApiProperty()
  message: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
