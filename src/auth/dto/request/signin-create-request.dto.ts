import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, Matches, Min } from 'class-validator';
import {
  IsStringNotEmpty,
  IsStringOptional,
} from 'src/common/decorators/combined-validations.decorator';

export class SignInRequestDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsStringNotEmpty()
  password: string;
}
