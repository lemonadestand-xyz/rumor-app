import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsObject,
  IsArray,
  Min,
  Max,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferType, PaymentSchedule } from '../domain/compensation-offer';

export class CreateDeliverableDto {
  @ApiProperty({
    description: 'Name of the deliverable',
    example: 'Event Planning Phase 1',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Description of what needs to be delivered',
    example: 'Complete venue selection and initial guest list',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Due date for the deliverable',
    example: '2024-12-15T18:00:00Z',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Payment amount for this deliverable',
    example: 1500.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paymentAmount: number;

  @ApiPropertyOptional({
    description: 'Whether this deliverable requires approval',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Order of this deliverable in the sequence',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    description: 'Acceptance criteria for the deliverable',
    example: { qualityStandards: 'Professional grade', timeframe: '2 weeks' },
  })
  @IsObject()
  @IsOptional()
  acceptanceCriteria?: Record<string, any>;
}

export class CreateOfferDto {
  @ApiProperty({
    description: 'Event ID this offer is for',
    example: 'uuid-event-id',
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'User ID receiving the offer (host)',
    example: 123,
  })
  @IsNumber()
  offeredToId: number;

  @ApiProperty({
    enum: OfferType,
    description: 'Type of compensation offer',
    example: OfferType.FLAT_FEE,
  })
  @IsEnum(OfferType)
  type: OfferType;

  @ApiProperty({
    description: 'Title of the offer',
    example: 'Host Party Event',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the work',
    example: 'Host our annual company party with 100 guests',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Base compensation amount',
    example: 5000.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  baseAmount: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Percentage for percentage-based offers',
    example: 20.0,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number;

  @ApiPropertyOptional({
    description: 'Hourly rate for hourly offers',
    example: 150.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Estimated hours for hourly offers',
    example: 40,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({
    enum: PaymentSchedule,
    description: 'Payment schedule',
    example: PaymentSchedule.MILESTONE_BASED,
  })
  @IsEnum(PaymentSchedule)
  paymentSchedule: PaymentSchedule;

  @ApiPropertyOptional({
    description: 'Upfront payment amount',
    example: 1000.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  upfrontAmount?: number;

  @ApiProperty({
    description: 'When work should start',
    example: '2024-12-01T09:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'When work should be completed',
    example: '2024-12-31T18:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'When offer expires',
    example: '2024-11-30T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Preferred payment method',
    example: 'Stripe',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Whether contract signature is required',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresContract?: boolean;

  @ApiPropertyOptional({
    description: 'Additional terms and conditions',
    example: {
      cancellationPolicy: '48 hours notice',
      dresscode: 'Business formal',
    },
  })
  @IsObject()
  @IsOptional()
  terms?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Performance metrics and bonuses',
    example: { attendeeTarget: 100, satisfactionBonus: 500 },
  })
  @IsObject()
  @IsOptional()
  performanceMetrics?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Deliverables for milestone-based payments',
    type: [CreateDeliverableDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliverableDto)
  @IsOptional()
  deliverables?: CreateDeliverableDto[];

  @ApiPropertyOptional({
    description: 'Additional offer metadata',
    example: { priority: 'high', category: 'corporate_event' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
