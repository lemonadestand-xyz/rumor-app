import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Event } from '../../events/domain/event';

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  EVENT_CHAT = 'EVENT_CHAT',
  BROADCAST = 'BROADCAST',
}

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export class Conversation {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    enum: ConversationType,
    example: ConversationType.DIRECT,
  })
  type: ConversationType;

  @ApiProperty({
    enum: ConversationStatus,
    example: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @ApiProperty({
    type: String,
    example: 'Party Planning Discussion',
    description: 'Title of the conversation (for groups/events)',
  })
  title?: string | null;

  @ApiProperty({
    type: String,
    example: 'Planning discussion for the upcoming party',
    description: 'Description of the conversation',
  })
  description?: string | null;

  @ApiProperty({
    type: () => User,
    description: 'User who created the conversation',
  })
  createdBy: User;

  @ApiProperty({
    type: () => Event,
    description: 'Related event (for event chats)',
  })
  event?: Event | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    description: 'Group avatar URL',
  })
  avatarUrl?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether conversation is pinned',
  })
  isPinned: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether conversation is muted',
  })
  isMuted: boolean;

  @ApiProperty({
    type: Number,
    example: 5,
    description: 'Number of participants',
  })
  participantCount: number;

  @ApiProperty({
    type: Number,
    example: 42,
    description: 'Total number of messages',
  })
  messageCount: number;

  @ApiProperty({
    type: Date,
    description: 'Last activity timestamp',
  })
  lastActivityAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'Hey everyone!',
    description: 'Preview of last message',
  })
  lastMessagePreview?: string | null;

  @ApiProperty({
    type: Object,
    description: 'Additional conversation settings',
  })
  settings?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
