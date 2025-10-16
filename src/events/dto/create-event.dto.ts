import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDate,
  IsArray,
  Min,
  Max,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EventType,
  EventStatus,
  DressCode,
  AgeRequirement,
} from '../domain/event';

export class CreateEventDto {
  @ApiProperty({ example: 'Summer Rooftop Networking Mixer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'summer-rooftop-networking-mixer', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example:
      'Join us for an exclusive networking event with stunning city views.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiProperty({ example: 'Rooftop Bar, 123 Main St' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  venueAddress: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 40.7128, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ example: -74.006, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ example: '2025-12-25T18:00:00Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-12-25T23:00:00Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  doorsOpenTime?: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  lastEntryTime?: Date;

  @ApiProperty({ enum: EventType, example: EventType.TICKETED })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({
    enum: EventStatus,
    example: EventStatus.DRAFT,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({ example: 'Tech & Startups' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: ['networking', 'tech', 'startups'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 20, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  minCapacity?: number;

  @ApiProperty({ example: 85.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  ticketPrice?: number;

  @ApiProperty({ example: 65.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  earlyBirdPrice?: number;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  earlyBirdDeadline?: Date;

  @ApiProperty({ example: 110.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  vipPrice?: number;

  @ApiProperty({ example: 20, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  vipCapacity?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowPlusOnes: boolean;

  @ApiProperty({ example: 45.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  plusOnePrice?: number;

  @ApiProperty({ enum: DressCode, required: false })
  @IsEnum(DressCode)
  @IsOptional()
  dressCode?: DressCode;

  @ApiProperty({
    enum: AgeRequirement,
    example: AgeRequirement.TWENTY_ONE_PLUS,
  })
  @IsEnum(AgeRequirement)
  ageRequirement: AgeRequirement;

  @ApiProperty({
    example: ['https://rumor.com/events/event1.jpg'],
    required: false,
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  imageUrls?: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  promoVideoUrl?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  requiresApproval: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  autoApproveMembers: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isSpotlightEvent?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  spotlightReason?: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  registrationDeadline?: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  cancellationDeadline?: Date;

  @ApiProperty({ example: 25.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  cancellationFee?: number;
}
