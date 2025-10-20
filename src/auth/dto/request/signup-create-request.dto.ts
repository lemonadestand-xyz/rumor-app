import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, Matches, Min } from 'class-validator';
import {
  IsStringNotEmpty,
  IsStringOptional,
} from 'src/common/decorators/combined-validations.decorator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsStringNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsStringNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsStringNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsStringNotEmpty()
  @Matches(/^\d{6,15}$/, {
    message: 'phoneNumber must be 6-15 digits',
  })
  phoneNumber: string;

  @ApiProperty({ example: '+1' })
  @IsStringNotEmpty()
  @Matches(/^\+\d{1,4}$/i, {
    message: 'callingCode must be like +1, +44, +965',
  })
  callingCode: string;

  @ApiProperty({ example: 'US' })
  @IsStringNotEmpty()
  @Matches(/^[A-Z]{2}$/i, {
    message: 'countryCode must be a 2-letter ISO code',
  })
  countryCode: string;

  @ApiProperty({ description: '# of events you host per year', example: 5 })
  @IsInt({ message: 'eventsPerYear must be an integer' })
  @Min(1, { message: 'eventsPerYear must be at least 1' })
  eventsPerYear: number;

  @ApiPropertyOptional({ example: 'https://www.justanother.com' })
  @IsStringOptional()
  @Matches(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
    {
      message: 'website must be a valid URL',
    },
  )
  website?: string;

  @ApiPropertyOptional({ description: 'Who referred you?' })
  @IsStringOptional()
  referredBy?: string;
}
