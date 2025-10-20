import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';

export class VerifyEmailResponseDto {
  static fromModel(model: {
    id: string;
    message: string;
    accessToken: string;
  }): IPublic<VerifyEmailResponseDto> {
    return {
      id: model.id,
      message: model.message,
      accessToken: model.accessToken,
    };
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  accessToken: string;
}
