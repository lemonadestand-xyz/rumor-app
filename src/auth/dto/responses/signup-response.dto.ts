import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';

export class SignUpResponseDto {
  static fromModel(model: {
    id: string;
    message: string;
  }): IPublic<SignUpResponseDto> {
    return { id: model.id, message: model.message };
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  message: string;
}
