import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export enum HostTier {
  ROOKIE = 'ROOKIE',
  RISING = 'RISING',
  ESTABLISHED = 'ESTABLISHED',
  ELITE = 'ELITE',
}

export class HostProfile {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: String,
    example: 'Tech & Startup',
  })
  category?: string | null;

  @ApiProperty({
    type: String,
    example:
      'Experienced event host specializing in tech meetups and networking events.',
  })
  description?: string | null;

  @ApiProperty({
    type: [String],
    example: ['Tech', 'Startups', 'Networking', 'Product Launches'],
  })
  specialties?: string[];

  @ApiProperty({
    enum: HostTier,
    example: HostTier.ESTABLISHED,
  })
  tier: HostTier;

  @ApiProperty({
    type: Number,
    example: 50,
  })
  totalEventsHosted: number;

  @ApiProperty({
    type: Number,
    example: 2500,
  })
  totalGuestsHosted: number;

  @ApiProperty({
    type: Number,
    example: 4.8,
  })
  averageRating: number;

  @ApiProperty({
    type: Number,
    example: 125000.0,
  })
  totalRevenueGenerated: number;

  @ApiProperty({
    type: Number,
    example: 5000.0,
  })
  averageTicketPrice: number;

  @ApiProperty({
    type: Number,
    example: 95.5,
  })
  averageAttendanceRate: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    type: Date,
  })
  verifiedAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isSpotlightHost: boolean;

  @ApiProperty({
    type: String,
    example:
      'Exceptional host with consistent 5-star ratings and innovative event concepts.',
  })
  spotlightReason?: string | null;

  @ApiProperty({
    type: Date,
  })
  lastEventDate?: Date | null;

  @ApiProperty({
    type: Date,
  })
  nextEventDate?: Date | null;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  upcomingEventsCount: number;

  @ApiProperty({
    type: Object,
    description: 'Host analytics and performance metrics',
  })
  analyticsData?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
