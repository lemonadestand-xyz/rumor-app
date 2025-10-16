import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { GuestType } from '../domain/guest';

export class CreateGuestDto {
  @ApiProperty({ example: 'uuid-event-id' })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ enum: GuestType, example: GuestType.REGULAR })
  @IsEnum(GuestType)
  guestType: GuestType;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasPlusOne: boolean;

  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsString()
  @IsOptional()
  plusOneName?: string;

  @ApiProperty({ example: 'jane.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  plusOneEmail?: string;

  @ApiProperty({ example: 'Vegan, no nuts', required: false })
  @IsString()
  @IsOptional()
  dietaryRestrictions?: string;

  @ApiProperty({ example: 'Looking forward to networking!', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  requiresApproval: boolean;
}
