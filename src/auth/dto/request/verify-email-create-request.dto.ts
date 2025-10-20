import { ApiProperty } from '@nestjs/swagger';
import { IsStringNotEmpty } from '../../../common/decorators/combined-validations.decorator';

export class VerifyEmailRequestDto {
  @ApiProperty()
  @IsStringNotEmpty()
  userId: string;
}
