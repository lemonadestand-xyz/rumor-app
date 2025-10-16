import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsObject,
  Length,
  ValidateIf,
} from 'class-validator';
import { InviteStatus, InviteType } from '../domain/event-invite';

export class CreateEventInviteDto {
  @ApiProperty({
    description: 'Event ID to send invitation for',
    example: 'uuid-event-id',
  })
  @IsString()
  eventId: string;

  @ApiPropertyOptional({
    description: 'Registered user ID to invite',
    example: 123,
  })
  @IsNumber()
  @IsOptional()
  invitedUserId?: number;

  @ApiPropertyOptional({
    description: 'Email for non-registered invitee',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => !o.invitedUserId || o.inviteeEmail)
  inviteeEmail?: string;

  @ApiPropertyOptional({
    description: 'Phone for non-registered invitee',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  @IsOptional()
  inviteePhone?: string;

  @ApiPropertyOptional({
    description: 'Name of the invitee',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  inviteeName?: string;

  @ApiProperty({
    enum: InviteType,
    description: 'Type of invitation',
    example: InviteType.EMAIL,
  })
  @IsEnum(InviteType)
  inviteType: InviteType;

  @ApiPropertyOptional({
    enum: InviteStatus,
    description: 'Initial status of the invitation',
    example: InviteStatus.PENDING,
    default: InviteStatus.PENDING,
  })
  @IsEnum(InviteStatus)
  @IsOptional()
  status?: InviteStatus;

  @ApiPropertyOptional({
    description: 'Personal message to include with the invitation',
    example: 'Looking forward to seeing you at my event!',
  })
  @IsString()
  @IsOptional()
  personalMessage?: string;

  @ApiPropertyOptional({
    description: 'Whether invitee can bring a plus one',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  allowPlusOne?: boolean;

  @ApiPropertyOptional({
    description: 'Invitation expiration date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Whether this is a VIP invitation',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isVIP?: boolean;

  @ApiPropertyOptional({
    description: 'Additional tracking metadata',
    example: { source: 'mobile_app', campaign: 'holiday_party' },
  })
  @IsObject()
  @IsOptional()
  trackingData?: Record<string, any>;
}
