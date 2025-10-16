import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Conversation } from './conversation';

export enum ParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export enum ParticipantStatus {
  ACTIVE = 'ACTIVE',
  LEFT = 'LEFT',
  REMOVED = 'REMOVED',
  BLOCKED = 'BLOCKED',
}

export class ConversationParticipant {
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
  })
  user: User;

  @ApiProperty({
    enum: ParticipantRole,
    example: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @ApiProperty({
    enum: ParticipantStatus,
    example: ParticipantStatus.ACTIVE,
  })
  status: ParticipantStatus;

  @ApiProperty({
    type: String,
    example: 'Party Planner',
    description: 'Custom nickname in this conversation',
  })
  nickname?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether participant has muted notifications',
  })
  isMuted: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether conversation is pinned for this participant',
  })
  isPinned: boolean;

  @ApiProperty({
    type: Date,
    description: 'When user joined the conversation',
  })
  joinedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When user left the conversation',
  })
  leftAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'Last time user read messages in this conversation',
  })
  lastReadAt?: Date | null;

  @ApiProperty({
    type: Number,
    example: 5,
    description: 'Number of unread messages',
  })
  unreadCount: number;

  @ApiProperty({
    type: Date,
    description: 'Last time user was active in this conversation',
  })
  lastSeenAt?: Date | null;

  @ApiProperty({
    type: () => User,
    description: 'User who added this participant',
  })
  addedBy?: User | null;

  @ApiProperty({
    type: Object,
    description: 'Participant-specific settings',
  })
  settings?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
