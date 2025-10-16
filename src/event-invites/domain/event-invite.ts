import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Event } from '../../events/domain/event';

export enum InviteStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum InviteType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
  LINK = 'LINK',
}

export class EventInvite {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Event,
  })
  event: Event;

  @ApiProperty({
    type: () => User,
    description: 'User who sent the invitation',
  })
  invitedBy: User;

  @ApiProperty({
    type: () => User,
    description: 'Registered user who is invited',
  })
  invitedUser?: User | null;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    description: 'Email for non-registered invitee',
  })
  inviteeEmail?: string | null;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    description: 'Phone for non-registered invitee',
  })
  inviteePhone?: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  inviteeName?: string | null;

  @ApiProperty({
    enum: InviteStatus,
    example: InviteStatus.SENT,
  })
  status: InviteStatus;

  @ApiProperty({
    enum: InviteType,
    example: InviteType.EMAIL,
  })
  inviteType: InviteType;

  @ApiProperty({
    type: String,
    example: 'INV-ABC123',
  })
  inviteCode: string;

  @ApiProperty({
    type: String,
    example: 'https://rumor.com/invite/ABC123',
  })
  inviteUrl: string;

  @ApiProperty({
    type: String,
    example: 'Looking forward to seeing you at my event!',
  })
  personalMessage?: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  allowPlusOne: boolean;

  @ApiProperty({
    type: Date,
  })
  sentAt?: Date | null;

  @ApiProperty({
    type: Date,
  })
  viewedAt?: Date | null;

  @ApiProperty({
    type: Date,
  })
  respondedAt?: Date | null;

  @ApiProperty({
    type: Date,
  })
  expiresAt?: Date | null;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  remindersSent: number;

  @ApiProperty({
    type: Date,
  })
  lastReminderAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isVIP: boolean;

  @ApiProperty({
    type: Object,
    description: 'Tracking data for email/SMS delivery',
  })
  trackingData?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
