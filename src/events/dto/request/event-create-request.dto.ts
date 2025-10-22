// src/events/dto/create-event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  Matches,
  IsOptional,
  ValidateIf,
  IsNumber,
  IsUUID,
} from 'class-validator';
import {
  IsStringNotEmpty,
  IsStringOptional,
} from 'src/common/decorators/combined-validations.decorator';
import { EVENT_LOCATION_TYPE, EVENT_STATUS, EVENT_VISIBILITY } from '../../enums/events.enum';


export class CreateEventDto {
  // Basic Information
  @ApiProperty({ example: 'Annual Tech Conference 2025' })
  @IsStringNotEmpty()
  eventName: string;

  @ApiPropertyOptional({ example: 'Conference' })
  @IsStringOptional()
  eventType?: string;

  @ApiPropertyOptional({ example: 'Public Event Flow' })
  @IsStringOptional()
  eventFlow?: string;

  // Date & Time
  @ApiProperty({ example: '2025-12-01', description: 'Event start date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'startDate must be a valid date string (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'startDate is required' })
  startDate: string;

  @ApiProperty({ example: '09:00:00', description: 'Event start time (HH:MM:SS)' })
  @IsStringNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM:SS format',
  })
  startTime: string;

  @ApiProperty({ example: '2025-12-01', description: 'Event end date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'endDate must be a valid date string (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: string;

  @ApiProperty({ example: '17:00:00', description: 'Event end time (HH:MM:SS)' })
  @IsStringNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM:SS format',
  })
  endTime: string;

  @ApiPropertyOptional({ example: 'America/New_York', default: 'UTC' })
  @IsStringOptional()
  timezone?: string;

  @ApiPropertyOptional({ 
    example: '2025-11-25',
    description: 'RSVP deadline date (YYYY-MM-DD)'
  })
  @IsOptional()
  @IsDateString({}, { message: 'rsvpByDate must be a valid date string (YYYY-MM-DD)' })
  rsvpByDate?: string;

  // Location Details
  @ApiProperty({ 
    enum: EVENT_LOCATION_TYPE,
    example: EVENT_LOCATION_TYPE.PHYSICAL,
    description: 'Type of event location'
  })
  @IsEnum(EVENT_LOCATION_TYPE, { message: 'locationType must be physical, virtual, or hybrid' })
  @IsNotEmpty({ message: 'locationType is required' })
  locationType: EVENT_LOCATION_TYPE;

  @ApiPropertyOptional({ example: 'Grand Convention Center' })
  @ValidateIf((o) => o.locationType === EVENT_LOCATION_TYPE.PHYSICAL || o.locationType === EVENT_LOCATION_TYPE.HYBRID)
  @IsStringOptional()
  venueName?: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @ValidateIf((o) => o.locationType === EVENT_LOCATION_TYPE.PHYSICAL || o.locationType === EVENT_LOCATION_TYPE.HYBRID)
  @IsStringOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Suite 100' })
  @IsStringOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @ValidateIf((o) => o.locationType === EVENT_LOCATION_TYPE.PHYSICAL || o.locationType === EVENT_LOCATION_TYPE.HYBRID)
  @IsStringOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  @IsStringOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @ValidateIf((o) => o.locationType === EVENT_LOCATION_TYPE.PHYSICAL || o.locationType === EVENT_LOCATION_TYPE.HYBRID)
  @IsStringOptional()
  country?: string;

  @ApiPropertyOptional({ example: '10001' })
  @IsStringOptional()
  postalCode?: string;

  @ApiPropertyOptional({ example: 40.7128 })
  @IsOptional()
  @IsNumber({}, { message: 'latitude must be a valid number' })
  @Min(-90, { message: 'latitude must be between -90 and 90' })
  @Max(90, { message: 'latitude must be between -90 and 90' })
  latitude?: number;

  @ApiPropertyOptional({ example: -74.0060 })
  @IsOptional()
  @IsNumber({}, { message: 'longitude must be a valid number' })
  @Min(-180, { message: 'longitude must be between -180 and 180' })
  @Max(180, { message: 'longitude must be between -180 and 180' })
  longitude?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'showFullAddressToConfirmedGuestsOnly must be a boolean' })
  showFullAddressToConfirmedGuestsOnly?: boolean;

  // Event Description
  @ApiPropertyOptional({ 
    example: 'Join us for an amazing tech conference...',
    description: 'Detailed event description' 
  })
  @IsStringOptional()
  eventDescription?: string;

  @ApiPropertyOptional({ 
    example: 'Annual tech conference with industry leaders',
    description: 'Short summary of the event'
  })
  @IsStringOptional()
  shortDescription?: string;

  // Visibility
  @ApiPropertyOptional({ 
    enum: EVENT_VISIBILITY,
    example: EVENT_VISIBILITY.PUBLIC,
    default: EVENT_VISIBILITY.PUBLIC
  })
  @IsOptional()
  @IsEnum(EVENT_VISIBILITY, { message: 'visibility must be public, private, or unlisted' })
  visibility?: EVENT_VISIBILITY;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'invitationOnlyApproval must be a boolean' })
  invitationOnlyApproval?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'allowAnyoneOutsideEventFlow must be a boolean' })
  allowAnyoneOutsideEventFlow?: boolean;

  // Event Settings - Event Series Fields
  @ApiPropertyOptional({ example: 'Drop-in Event' })
  @IsStringOptional()
  eventStrategy?: string;

  @ApiPropertyOptional({ example: 10, description: 'Minimum number of attendees' })
  @IsOptional()
  @IsInt({ message: 'minCapacity must be an integer' })
  @Min(0, { message: 'minCapacity must be at least 0' })
  minCapacity?: number;

  @ApiPropertyOptional({ example: 100, description: 'Maximum number of attendees' })
  @IsOptional()
  @IsInt({ message: 'maxCapacity must be an integer' })
  @Min(1, { message: 'maxCapacity must be at least 1' })
  maxCapacity?: number;

  // Event Flow Settings
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'isEventPartOfEventFlow must be a boolean' })
  isEventPartOfEventFlow?: boolean;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the event flow'
  })
  @IsOptional()
  @IsUUID('4', { message: 'selectEventFlowId must be a valid UUID' })
  selectEventFlowId?: string;

  @ApiPropertyOptional({ example: 'Block A, Block B' })
  @IsStringOptional()
  selectEventBlocks?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'showTicketTypesInGuests must be a boolean' })
  showTicketTypesInGuests?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'enableQrCode must be a boolean' })
  enableQrCode?: boolean;

  @ApiPropertyOptional({ 
    example: 'https://example.com/images/series-artwork.jpg',
    description: 'URL to event series artwork'
  })
  @IsStringOptional()
  @Matches(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
    {
      message: 'eventSeriesArtworkUrl must be a valid URL',
    },
  )
  eventSeriesArtworkUrl?: string;

  @ApiPropertyOptional({ 
    example: 'immediately',
    description: 'When to send invites: immediately, later, or never'
  })
  @IsStringOptional()
  @Matches(/^(immediately|later|never)$/i, {
    message: 'sendInvitesOption must be immediately, later, or never',
  })
  sendInvitesOption?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'sendNow must be a boolean' })
  sendNow?: boolean;

  // Recurring Event Settings
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'isRecurring must be a boolean' })
  isRecurring?: boolean;

  @ApiPropertyOptional({ 
    example: 'weekly',
    description: 'Recurrence pattern: daily, weekly, monthly, yearly'
  })
  @ValidateIf((o) => o.isRecurring === true)
  @IsStringOptional()
  @Matches(/^(daily|weekly|monthly|yearly)$/i, {
    message: 'recurrencePattern must be daily, weekly, monthly, or yearly',
  })
  recurrencePattern?: string;

  @ApiPropertyOptional({ 
    example: '2025-12-31',
    description: 'Date when recurrence ends (YYYY-MM-DD)'
  })
  @ValidateIf((o) => o.isRecurring === true)
  @IsOptional()
  @IsDateString({}, { message: 'recurrenceEndDate must be a valid date string (YYYY-MM-DD)' })
  recurrenceEndDate?: string;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of parent event for recurring events'
  })
  @IsOptional()
  @IsUUID('4', { message: 'parentEventId must be a valid UUID' })
  parentEventId?: string;

  // Media
  @ApiPropertyOptional({ 
    example: 'https://example.com/images/featured.jpg',
    description: 'URL to featured image'
  })
  @IsStringOptional()
  @Matches(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
    {
      message: 'featuredImageId must be a valid URL',
    },
  )
  featuredImageId?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/images/banner.jpg',
    description: 'URL to banner image'
  })
  @IsStringOptional()
  @Matches(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
    {
      message: 'bannerImageId must be a valid URL',
    },
  )
  bannerImageId?: string;

  // Status
  @ApiPropertyOptional({ 
    enum: EVENT_STATUS,
    example: EVENT_STATUS.DRAFT,
    default: EVENT_STATUS.DRAFT
  })
  @IsOptional()
  @IsEnum(EVENT_STATUS, { message: 'status must be draft, published, cancelled, or completed' })
  status?: EVENT_STATUS;
}