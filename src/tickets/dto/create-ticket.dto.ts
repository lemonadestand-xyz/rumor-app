import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsObject,
  Min,
  Max,
  Length,
} from 'class-validator';
import { TicketType, TicketStatus } from '../domain/ticket';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Event ID that this ticket belongs to',
    example: 'uuid-event-id',
  })
  @IsString()
  eventId: string;

  @ApiPropertyOptional({
    description: 'Guest ID if ticket is assigned to a guest',
    example: 'uuid-guest-id',
  })
  @IsString()
  @IsOptional()
  guestId?: string;

  @ApiPropertyOptional({
    description: 'Owner user ID',
    example: 123,
  })
  @IsNumber()
  @IsOptional()
  ownerId?: number;

  @ApiPropertyOptional({
    description: 'User ID who purchased the ticket',
    example: 123,
  })
  @IsNumber()
  @IsOptional()
  purchasedById?: number;

  @ApiProperty({
    enum: TicketType,
    description: 'Type of ticket',
    example: TicketType.GENERAL,
  })
  @IsEnum(TicketType)
  ticketType: TicketType;

  @ApiPropertyOptional({
    enum: TicketStatus,
    description: 'Ticket status',
    example: TicketStatus.AVAILABLE,
    default: TicketStatus.AVAILABLE,
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiProperty({
    description: 'Ticket price',
    example: 85.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Actually paid price (may differ from list price)',
    example: 75.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  paidPrice?: number;

  @ApiPropertyOptional({
    description: 'Service fee charged',
    example: 8.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  serviceFee?: number;

  @ApiPropertyOptional({
    description: 'Discount code applied',
    example: 'SUMMER20',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  discountCode?: string;

  @ApiPropertyOptional({
    description: 'Discount amount applied',
    example: 20.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({
    description: 'Payment reference from payment processor',
    example: 'stripe_payment_123',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  paymentReference?: string;

  @ApiPropertyOptional({
    description: 'Payment method used',
    example: 'Stripe',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Barcode for the ticket',
    example: 'abc123def456',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  barcode?: string;

  @ApiProperty({
    description: 'Valid from date',
    example: '2024-12-01T00:00:00Z',
  })
  @IsDateString()
  validFrom: string;

  @ApiProperty({
    description: 'Valid until date',
    example: '2024-12-01T23:59:59Z',
  })
  @IsDateString()
  validUntil: string;

  @ApiPropertyOptional({
    description: 'Whether ticket can be transferred',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isTransferable?: boolean;

  @ApiPropertyOptional({
    description: 'Seat number',
    example: 'A12',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  seatNumber?: string;

  @ApiPropertyOptional({
    description: 'Section of the venue',
    example: 'VIP Section',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  section?: string;

  @ApiPropertyOptional({
    description: 'Additional ticket metadata',
    example: { specialRequests: 'Vegetarian meal' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
