import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Event } from '../../events/domain/event';
import { Guest } from '../../guests/domain/guest';

export enum TicketType {
  GENERAL = 'GENERAL',
  VIP = 'VIP',
  EARLY_BIRD = 'EARLY_BIRD',
  GROUP = 'GROUP',
  COMP = 'COMP',
  MEDIA = 'MEDIA',
}

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  TRANSFERRED = 'TRANSFERRED',
}

export class Ticket {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Event,
  })
  event: Event;

  @ApiProperty({
    type: () => Guest,
  })
  guest?: Guest | null;

  @ApiProperty({
    type: () => User,
    description: 'Current owner of the ticket',
  })
  owner?: User | null;

  @ApiProperty({
    type: () => User,
    description: 'Original purchaser of the ticket',
  })
  purchasedBy?: User | null;

  @ApiProperty({
    type: String,
    example: 'TKT-ABC123',
  })
  ticketNumber: string;

  @ApiProperty({
    enum: TicketType,
    example: TicketType.GENERAL,
  })
  ticketType: TicketType;

  @ApiProperty({
    enum: TicketStatus,
    example: TicketStatus.SOLD,
  })
  status: TicketStatus;

  @ApiProperty({
    type: Number,
    example: 85.0,
  })
  price: number;

  @ApiProperty({
    type: Number,
    example: 85.0,
  })
  paidPrice?: number | null;

  @ApiProperty({
    type: Number,
    example: 8.5,
  })
  serviceFee?: number | null;

  @ApiProperty({
    type: String,
    example: 'SUMMER20',
  })
  discountCode?: string | null;

  @ApiProperty({
    type: Number,
    example: 20.0,
  })
  discountAmount?: number | null;

  @ApiProperty({
    type: Date,
  })
  purchasedAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'stripe_payment_123',
  })
  paymentReference?: string | null;

  @ApiProperty({
    type: String,
    example: 'Stripe',
  })
  paymentMethod?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://rumor.com/qr/TKT-ABC123',
  })
  qrCode: string;

  @ApiProperty({
    type: String,
    example: 'abc123def456',
  })
  barcode?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isUsed: boolean;

  @ApiProperty({
    type: Date,
  })
  usedAt?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  scannedBy?: User | null;

  @ApiProperty({
    type: Date,
  })
  validFrom: Date;

  @ApiProperty({
    type: Date,
  })
  validUntil: Date;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isTransferable: boolean;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  transferCount: number;

  @ApiProperty({
    type: Date,
  })
  lastTransferredAt?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  transferredFrom?: User | null;

  @ApiProperty({
    type: () => User,
  })
  transferredTo?: User | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isRefunded: boolean;

  @ApiProperty({
    type: Date,
  })
  refundedAt?: Date | null;

  @ApiProperty({
    type: Number,
    example: 85.0,
  })
  refundAmount?: number | null;

  @ApiProperty({
    type: String,
    example: 'Customer request',
  })
  refundReason?: string | null;

  @ApiProperty({
    type: String,
    example: 'Table 5',
  })
  seatNumber?: string | null;

  @ApiProperty({
    type: String,
    example: 'VIP Section',
  })
  section?: string | null;

  @ApiProperty({
    type: Object,
    description: 'Additional ticket metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
