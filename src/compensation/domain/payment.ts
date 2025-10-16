import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { CompensationOffer } from './compensation-offer';
import { Deliverable } from './deliverable';

export enum PaymentType {
  OFFER_PAYMENT = 'OFFER_PAYMENT',
  MILESTONE_PAYMENT = 'MILESTONE_PAYMENT',
  BONUS_PAYMENT = 'BONUS_PAYMENT',
  REFUND = 'REFUND',
  PENALTY = 'PENALTY',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  ON_HOLD = 'ON_HOLD',
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CRYPTO = 'CRYPTO',
  CASH = 'CASH',
  OTHER = 'OTHER',
}

export class Payment {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => CompensationOffer,
    description: 'Compensation offer this payment is for',
  })
  offer: CompensationOffer;

  @ApiProperty({
    type: () => Deliverable,
    description: 'Deliverable this payment is for (if applicable)',
  })
  deliverable?: Deliverable | null;

  @ApiProperty({
    type: () => User,
    description: 'User making the payment (client)',
  })
  paidBy: User;

  @ApiProperty({
    type: () => User,
    description: 'User receiving the payment (host)',
  })
  paidTo: User;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.MILESTONE_PAYMENT,
  })
  type: PaymentType;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiProperty({
    type: Number,
    example: 2500.0,
    description: 'Payment amount',
  })
  amount: number;

  @ApiProperty({
    type: String,
    example: 'USD',
    description: 'Currency code',
  })
  currency: string;

  @ApiProperty({
    type: Number,
    example: 75.0,
    description: 'Platform fee amount',
  })
  platformFee?: number | null;

  @ApiProperty({
    type: Number,
    example: 2.5,
    description: 'Platform fee percentage',
  })
  platformFeeRate?: number | null;

  @ApiProperty({
    type: Number,
    example: 30.0,
    description: 'Payment processing fee',
  })
  processingFee?: number | null;

  @ApiProperty({
    type: Number,
    example: 2395.0,
    description: 'Net amount received by host',
  })
  netAmount: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.STRIPE,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    type: String,
    example: 'stripe_payment_intent_123',
    description: 'Reference from payment processor',
  })
  paymentReference?: string | null;

  @ApiProperty({
    type: String,
    example: 'stripe_transfer_456',
    description: 'Reference for payout to host',
  })
  payoutReference?: string | null;

  @ApiProperty({
    type: String,
    example: 'Milestone 1 completion payment',
    description: 'Description of the payment',
  })
  description?: string | null;

  @ApiProperty({
    type: Date,
    description: 'When payment was initiated',
  })
  initiatedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When payment was processed',
  })
  processedAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When payment was completed',
  })
  completedAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When payment failed',
  })
  failedAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'Insufficient funds',
    description: 'Failure reason if payment failed',
  })
  failureReason?: string | null;

  @ApiProperty({
    type: Date,
    description: 'When payment was refunded',
  })
  refundedAt?: Date | null;

  @ApiProperty({
    type: Number,
    example: 2500.0,
    description: 'Refund amount',
  })
  refundAmount?: number | null;

  @ApiProperty({
    type: String,
    example: 'Customer request',
    description: 'Refund reason',
  })
  refundReason?: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether payment requires approval',
  })
  requiresApproval: boolean;

  @ApiProperty({
    type: () => User,
    description: 'User who approved the payment',
  })
  approvedBy?: User | null;

  @ApiProperty({
    type: Date,
    description: 'When payment was approved',
  })
  approvedAt?: Date | null;

  @ApiProperty({
    type: Object,
    description: 'Tax information for the payment',
  })
  taxInfo?: Record<string, any>;

  @ApiProperty({
    type: Object,
    description: 'Additional payment metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
