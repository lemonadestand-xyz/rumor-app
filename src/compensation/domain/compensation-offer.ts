import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Event } from '../../events/domain/event';

export enum OfferType {
  FLAT_FEE = 'FLAT_FEE',
  HOURLY_RATE = 'HOURLY_RATE',
  PERCENTAGE = 'PERCENTAGE',
  PERFORMANCE_BASED = 'PERFORMANCE_BASED',
  EQUITY = 'EQUITY',
  HYBRID = 'HYBRID',
}

export enum OfferStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  NEGOTIATING = 'NEGOTIATING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentSchedule {
  UPFRONT = 'UPFRONT',
  ON_COMPLETION = 'ON_COMPLETION',
  MILESTONE_BASED = 'MILESTONE_BASED',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  POST_EVENT = 'POST_EVENT',
  SPLIT = 'SPLIT',
}

export class CompensationOffer {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Event,
    description: 'Event this offer is for',
  })
  event: Event;

  @ApiProperty({
    type: () => User,
    description: 'User making the offer (client)',
  })
  offeredBy: User;

  @ApiProperty({
    type: () => User,
    description: 'User receiving the offer (host)',
  })
  offeredTo: User;

  @ApiProperty({
    enum: OfferType,
    example: OfferType.FLAT_FEE,
  })
  type: OfferType;

  @ApiProperty({
    enum: OfferStatus,
    example: OfferStatus.PENDING,
  })
  status: OfferStatus;

  @ApiProperty({
    type: String,
    example: 'Host Party Event',
    description: 'Title/description of the offer',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Host our annual company party with 100 guests',
    description: 'Detailed description of the work',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 5000.0,
    description: 'Base compensation amount',
  })
  baseAmount: number;

  @ApiProperty({
    type: String,
    example: 'USD',
    description: 'Currency code',
  })
  currency: string;

  @ApiProperty({
    type: Number,
    example: 20.0,
    description: 'Percentage for percentage-based offers',
  })
  percentage?: number | null;

  @ApiProperty({
    type: Number,
    example: 150.0,
    description: 'Hourly rate for hourly offers',
  })
  hourlyRate?: number | null;

  @ApiProperty({
    type: Number,
    example: 40,
    description: 'Estimated hours for hourly offers',
  })
  estimatedHours?: number | null;

  @ApiProperty({
    enum: PaymentSchedule,
    example: PaymentSchedule.MILESTONE_BASED,
  })
  paymentSchedule: PaymentSchedule;

  @ApiProperty({
    type: Number,
    example: 1000.0,
    description: 'Upfront payment amount',
  })
  upfrontAmount?: number | null;

  @ApiProperty({
    type: Date,
    description: 'When work should start',
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'When work should be completed',
  })
  endDate: Date;

  @ApiProperty({
    type: Date,
    description: 'When offer expires',
  })
  expiresAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When offer was sent',
  })
  sentAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When offer was viewed',
  })
  viewedAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When offer was responded to',
  })
  respondedAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'Looking forward to working together!',
    description: 'Response message from recipient',
  })
  responseMessage?: string | null;

  @ApiProperty({
    type: String,
    example: 'Stripe',
    description: 'Preferred payment method',
  })
  paymentMethod?: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether contract signature is required',
  })
  requiresContract: boolean;

  @ApiProperty({
    type: String,
    example: 'https://example.com/contract.pdf',
    description: 'URL to contract document',
  })
  contractUrl?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether contract has been signed',
  })
  contractSigned: boolean;

  @ApiProperty({
    type: Date,
    description: 'When contract was signed',
  })
  contractSignedAt?: Date | null;

  @ApiProperty({
    type: Object,
    description: 'Additional terms and conditions',
  })
  terms?: Record<string, any>;

  @ApiProperty({
    type: Object,
    description: 'Performance metrics and bonuses',
  })
  performanceMetrics?: Record<string, any>;

  @ApiProperty({
    type: Object,
    description: 'Additional offer metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
