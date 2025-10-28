import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';

export class ResendVerifyEmailResponseDto {
  static fromModel(model: {
    id: string;
    message: string;
  }): IPublic<ResendVerifyEmailResponseDto> {
    return {
      id: model.id,
      message: model.message,
    };
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  message: string;
}
