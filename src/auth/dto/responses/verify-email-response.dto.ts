import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';

export class VerifyEmailResponseDto {
  static fromModel(model: {
    id: string;
    message: string;
  }): IPublic<VerifyEmailResponseDto> {
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
