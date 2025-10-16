import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsObject,
  Length,
  ArrayMinSize,
} from 'class-validator';
import { ConversationType } from '../domain/conversation';

export class CreateConversationDto {
  @ApiProperty({
    enum: ConversationType,
    description: 'Type of conversation to create',
    example: ConversationType.GROUP,
  })
  @IsEnum(ConversationType)
  type: ConversationType;

  @ApiPropertyOptional({
    description: 'Title of the conversation (required for groups)',
    example: 'Party Planning Group',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the conversation',
    example: 'Discussion group for planning the upcoming party',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Event ID for event-based conversations',
    example: 'uuid-event-id',
  })
  @IsString()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL for the conversation',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Array of user IDs to add as participants',
    example: [123, 456, 789],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  participantIds: number[];

  @ApiPropertyOptional({
    description: 'Initial message to send when creating the conversation',
    example: 'Welcome to our party planning group!',
  })
  @IsString()
  @IsOptional()
  initialMessage?: string;

  @ApiPropertyOptional({
    description: 'Whether conversation is pinned',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiPropertyOptional({
    description: 'Additional conversation settings',
    example: { allowFileSharing: true, allowVoiceMessages: true },
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
