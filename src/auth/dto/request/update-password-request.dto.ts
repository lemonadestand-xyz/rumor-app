import { ApiProperty } from '@nestjs/swagger';
import {
  IsStringNotEmpty,
  IsStrongPassword,
  Match,
} from '../../../common/decorators/combined-validations.decorator';

export class UpdatePasswordRequestDto {
  @ApiProperty()
  @IsStrongPassword({ message: 'password must be strong' })
  @IsStringNotEmpty()
  password: string;

  @ApiProperty()
  @IsStrongPassword({ message: 'password must be strong' })
  @IsStringNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
