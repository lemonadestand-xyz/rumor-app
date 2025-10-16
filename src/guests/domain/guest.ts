import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Event } from '../../events/domain/event';

export enum RSVPStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  MAYBE = 'MAYBE',
  WAITLIST = 'WAITLIST',
  CANCELLED = 'CANCELLED',
}

export enum GuestType {
  REGULAR = 'REGULAR',
  VIP = 'VIP',
  PLUS_ONE = 'PLUS_ONE',
  COMP = 'COMP',
  MEDIA = 'MEDIA',
  SPONSOR = 'SPONSOR',
}

export enum CheckInStatus {
  NOT_CHECKED_IN = 'NOT_CHECKED_IN',
  CHECKED_IN = 'CHECKED_IN',
  NO_SHOW = 'NO_SHOW',
}

export class Guest {
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
  })
  user: User;

  @ApiProperty({
    type: () => User,
    description: 'User who invited this guest',
  })
  invitedBy?: User | null;

  @ApiProperty({
    enum: RSVPStatus,
    example: RSVPStatus.ACCEPTED,
  })
  rsvpStatus: RSVPStatus;

  @ApiProperty({
    enum: GuestType,
    example: GuestType.REGULAR,
  })
  guestType: GuestType;

  @ApiProperty({
    type: Date,
  })
  invitedAt: Date;

  @ApiProperty({
    type: Date,
  })
  respondedAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  hasPlusOne: boolean;

  @ApiProperty({
    type: String,
    example: 'Jane Doe',
  })
  plusOneName?: string | null;

  @ApiProperty({
    type: String,
    example: 'jane.doe@example.com',
  })
  plusOneEmail?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  plusOneCheckedIn: boolean;

  @ApiProperty({
    enum: CheckInStatus,
    example: CheckInStatus.NOT_CHECKED_IN,
  })
  checkInStatus: CheckInStatus;

  @ApiProperty({
    type: Date,
  })
  checkedInAt?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  checkedInBy?: User | null;

  @ApiProperty({
    type: String,
    example: 'ABC123',
  })
  ticketCode?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://rumor.com/qr/ABC123',
  })
  qrCodeUrl?: string | null;

  @ApiProperty({
    type: Number,
    example: 85.0,
  })
  ticketPrice?: number | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isPaid: boolean;

  @ApiProperty({
    type: Date,
  })
  paidAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'stripe_payment_123',
  })
  paymentReference?: string | null;

  @ApiProperty({
    type: String,
    example: 'Vegan',
  })
  dietaryRestrictions?: string | null;

  @ApiProperty({
    type: String,
    example: 'Looking forward to networking!',
  })
  notes?: string | null;

  @ApiProperty({
    type: Number,
    example: 5,
  })
  waitlistPosition?: number | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  requiresApproval: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isApproved: boolean;

  @ApiProperty({
    type: Date,
  })
  approvedAt?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  approvedBy?: User | null;

  @ApiProperty({
    type: Number,
    example: 4,
  })
  eventRating?: number | null;

  @ApiProperty({
    type: String,
    example: 'Great event! Had an amazing time.',
  })
  eventReview?: string | null;

  @ApiProperty({
    type: Date,
  })
  reviewSubmittedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
