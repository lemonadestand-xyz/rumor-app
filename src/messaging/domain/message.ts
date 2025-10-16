import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Conversation } from './conversation';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  LOCATION = 'LOCATION',
  SYSTEM = 'SYSTEM',
  EVENT_UPDATE = 'EVENT_UPDATE',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export class Message {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Conversation,
  })
  conversation: Conversation;

  @ApiProperty({
    type: () => User,
    description: 'User who sent the message',
  })
  sender: User;

  @ApiProperty({
    type: () => Message,
    description: 'Message being replied to',
  })
  replyTo?: Message | null;

  @ApiProperty({
    enum: MessageType,
    example: MessageType.TEXT,
  })
  type: MessageType;

  @ApiProperty({
    enum: MessageStatus,
    example: MessageStatus.SENT,
  })
  status: MessageStatus;

  @ApiProperty({
    type: String,
    example: 'Hello everyone! How are you doing?',
    description: 'Message content',
  })
  content?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/image.jpg',
    description: 'Media URL for images, videos, files',
  })
  mediaUrl?: string | null;

  @ApiProperty({
    type: String,
    example: 'image.jpg',
    description: 'Original filename for file uploads',
  })
  fileName?: string | null;

  @ApiProperty({
    type: Number,
    example: 1024000,
    description: 'File size in bytes',
  })
  fileSize?: number | null;

  @ApiProperty({
    type: String,
    example: 'image/jpeg',
    description: 'MIME type of the file',
  })
  mimeType?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/thumbnail.jpg',
    description: 'Thumbnail URL for media',
  })
  thumbnailUrl?: string | null;

  @ApiProperty({
    type: Number,
    example: 30,
    description: 'Duration in seconds for audio/video',
  })
  duration?: number | null;

  @ApiProperty({
    type: Object,
    description: 'Location data with lat/lng',
    example: { latitude: 40.7128, longitude: -74.006, address: 'New York, NY' },
  })
  location?: Record<string, any>;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether message has been edited',
  })
  isEdited: boolean;

  @ApiProperty({
    type: Date,
    description: 'When message was edited',
  })
  editedAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether message is pinned',
  })
  isPinned: boolean;

  @ApiProperty({
    type: Date,
    description: 'When message was pinned',
  })
  pinnedAt?: Date | null;

  @ApiProperty({
    type: () => User,
    description: 'User who pinned the message',
  })
  pinnedBy?: User | null;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Number of reactions',
  })
  reactionCount: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Number of replies to this message',
  })
  replyCount: number;

  @ApiProperty({
    type: Date,
    description: 'When message expires (for temporary messages)',
  })
  expiresAt?: Date | null;

  @ApiProperty({
    type: Object,
    description: 'Additional message metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
