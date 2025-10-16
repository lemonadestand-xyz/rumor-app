import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
  Length,
  ValidateIf,
} from 'class-validator';
import { MessageType } from '../domain/message';

export class SendMessageDto {
  @ApiProperty({
    description: 'Conversation ID to send message to',
    example: 'uuid-conversation-id',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    enum: MessageType,
    description: 'Type of message',
    example: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiPropertyOptional({
    description: 'Message content (required for text messages)',
    example: 'Hello everyone! How is the planning going?',
  })
  @IsString()
  @Length(1, 10000)
  @ValidateIf(
    (o) => o.type === MessageType.TEXT || o.type === MessageType.SYSTEM,
  )
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Media URL for images, videos, audio, files',
    example: 'https://example.com/file.jpg',
  })
  @IsString()
  @ValidateIf((o) =>
    [
      MessageType.IMAGE,
      MessageType.VIDEO,
      MessageType.AUDIO,
      MessageType.FILE,
    ].includes(o.type),
  )
  @IsOptional()
  mediaUrl?: string;

  @ApiPropertyOptional({
    description: 'Original filename for file uploads',
    example: 'party-plans.pdf',
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL for media files',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Duration in seconds for audio/video',
    example: 120,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Location data with coordinates and address',
    example: { latitude: 40.7128, longitude: -74.006, address: 'New York, NY' },
  })
  @IsObject()
  @ValidateIf((o) => o.type === MessageType.LOCATION)
  @IsOptional()
  location?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Message ID being replied to',
    example: 'uuid-message-id',
  })
  @IsString()
  @IsOptional()
  replyToId?: string;

  @ApiPropertyOptional({
    description: 'Additional message metadata',
    example: { source: 'mobile_app', edited: false },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
