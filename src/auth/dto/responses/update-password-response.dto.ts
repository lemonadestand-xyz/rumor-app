import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from '../../../common/utils/public.type';

export class UpdatePasswordResponseDto {
  static fromModel(model: {
    id: string;
    message: string;
  }): IPublic<UpdatePasswordResponseDto> {
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
