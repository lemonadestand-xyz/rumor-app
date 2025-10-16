import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EventType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY',
  TICKETED = 'TICKETED',
  FREE = 'FREE',
}

export enum DressCode {
  CASUAL = 'CASUAL',
  SMART_CASUAL = 'SMART_CASUAL',
  BUSINESS_CASUAL = 'BUSINESS_CASUAL',
  COCKTAIL = 'COCKTAIL',
  FORMAL = 'FORMAL',
  BLACK_TIE = 'BLACK_TIE',
  THEMED = 'THEMED',
}

export enum AgeRequirement {
  ALL_AGES = 'ALL_AGES',
  EIGHTEEN_PLUS = '18+',
  TWENTY_ONE_PLUS = '21+',
  TWENTY_FIVE_PLUS = '25+',
}

export class Event {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => User,
  })
  host: User;

  @ApiProperty({
    type: String,
    example: 'Summer Rooftop Networking Mixer',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'summer-rooftop-networking-mixer',
  })
  slug: string;

  @ApiProperty({
    type: String,
    example:
      'Join us for an exclusive networking event with stunning city views.',
  })
  description: string;

  @ApiProperty({
    type: String,
    example: 'Experience an unforgettable evening of networking...',
  })
  longDescription?: string | null;

  @ApiProperty({
    type: String,
    example: 'Rooftop Bar, 123 Main St, New York, NY 10001',
  })
  venue: string;

  @ApiProperty({
    type: String,
    example: '123 Main Street',
  })
  venueAddress: string;

  @ApiProperty({
    type: String,
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    type: String,
    example: 'NY',
  })
  state?: string | null;

  @ApiProperty({
    type: String,
    example: '10001',
  })
  zipCode?: string | null;

  @ApiProperty({
    type: String,
    example: 'United States',
  })
  country: string;

  @ApiProperty({
    type: Number,
    example: 40.7128,
  })
  latitude?: number | null;

  @ApiProperty({
    type: Number,
    example: -74.006,
  })
  longitude?: number | null;

  @ApiProperty({
    type: Date,
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  endDate: Date;

  @ApiProperty({
    type: Date,
  })
  doorsOpenTime?: Date | null;

  @ApiProperty({
    type: Date,
  })
  lastEntryTime?: Date | null;

  @ApiProperty({
    enum: EventType,
    example: EventType.TICKETED,
  })
  eventType: EventType;

  @ApiProperty({
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
  })
  status: EventStatus;

  @ApiProperty({
    type: String,
    example: 'Tech & Startups',
  })
  category: string;

  @ApiProperty({
    type: [String],
    example: ['networking', 'tech', 'startups', 'rooftop'],
  })
  tags: string[];

  @ApiProperty({
    type: Number,
    example: 150,
  })
  capacity: number;

  @ApiProperty({
    type: Number,
    example: 20,
  })
  minCapacity?: number | null;

  @ApiProperty({
    type: Number,
    example: 85.0,
  })
  ticketPrice?: number | null;

  @ApiProperty({
    type: Number,
    example: 65.0,
  })
  earlyBirdPrice?: number | null;

  @ApiProperty({
    type: Date,
  })
  earlyBirdDeadline?: Date | null;

  @ApiProperty({
    type: Number,
    example: 110.0,
  })
  vipPrice?: number | null;

  @ApiProperty({
    type: Number,
    example: 20,
  })
  vipCapacity?: number | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  allowPlusOnes: boolean;

  @ApiProperty({
    type: Number,
    example: 45.0,
  })
  plusOnePrice?: number | null;

  @ApiProperty({
    enum: DressCode,
    example: DressCode.COCKTAIL,
  })
  dressCode?: DressCode | null;

  @ApiProperty({
    enum: AgeRequirement,
    example: AgeRequirement.TWENTY_ONE_PLUS,
  })
  ageRequirement: AgeRequirement;

  @ApiProperty({
    type: [String],
    example: ['https://rumor.com/events/summer-mixer-1.jpg'],
  })
  imageUrls: string[];

  @ApiProperty({
    type: String,
    example: 'https://rumor.com/events/summer-mixer-cover.jpg',
  })
  coverImageUrl?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://rumor.com/events/summer-mixer-promo.mp4',
  })
  promoVideoUrl?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  requiresApproval: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  autoApproveMembers: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isSpotlightEvent: boolean;

  @ApiProperty({
    type: String,
    example: 'Featured summer networking event',
  })
  spotlightReason?: string | null;

  @ApiProperty({
    type: Date,
  })
  registrationDeadline?: Date | null;

  @ApiProperty({
    type: Date,
  })
  cancellationDeadline?: Date | null;

  @ApiProperty({
    type: Number,
    example: 25.0,
  })
  cancellationFee?: number | null;

  @ApiProperty({
    type: Number,
    example: 120,
  })
  currentAttendees: number;

  @ApiProperty({
    type: Number,
    example: 15,
  })
  waitlistCount: number;

  @ApiProperty({
    type: Number,
    example: 4.8,
  })
  averageRating?: number | null;

  @ApiProperty({
    type: Number,
    example: 45,
  })
  totalReviews: number;

  @ApiProperty({
    type: Number,
    example: 10200.0,
  })
  totalRevenue?: number | null;

  @ApiProperty({
    type: Number,
    example: 118,
  })
  actualAttendees?: number | null;

  @ApiProperty({
    type: Number,
    example: 98.3,
  })
  attendanceRate?: number | null;

  @ApiProperty({
    type: Object,
    description: 'Event analytics and metrics',
  })
  analyticsData?: Record<string, any>;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isCancelled: boolean;

  @ApiProperty({
    type: String,
    example: 'Weather conditions',
  })
  cancellationReason?: string | null;

  @ApiProperty({
    type: Date,
  })
  cancelledAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date | null;
}
