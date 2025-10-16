import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export enum PersonalityType {
  ARCHITECT = 'ARCHITECT',
  LOGICIAN = 'LOGICIAN',
  COMMANDER = 'COMMANDER',
  DEBATER = 'DEBATER',
  ADVOCATE = 'ADVOCATE',
  MEDIATOR = 'MEDIATOR',
  PROTAGONIST = 'PROTAGONIST',
  CAMPAIGNER = 'CAMPAIGNER',
  LOGISTICIAN = 'LOGISTICIAN',
  DEFENDER = 'DEFENDER',
  EXECUTIVE = 'EXECUTIVE',
  CONSUL = 'CONSUL',
  VIRTUOSO = 'VIRTUOSO',
  ADVENTURER = 'ADVENTURER',
  ENTREPRENEUR = 'ENTREPRENEUR',
  ENTERTAINER = 'ENTERTAINER',
}

export class MemberProfile {
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
    example:
      'I am a creative professional who loves networking at exclusive events.',
  })
  bio?: string | null;

  @ApiProperty({
    type: String,
    example: 'New York, NY',
  })
  location?: string | null;

  @ApiProperty({
    type: String,
    example: 'Marketing Manager',
  })
  profession?: string | null;

  @ApiProperty({
    type: [String],
    example: ['Music', 'Fashion', 'Tech', 'Art'],
  })
  interests?: string[];

  @ApiProperty({
    enum: PersonalityType,
    example: PersonalityType.ARCHITECT,
  })
  personalityType?: PersonalityType | null;

  @ApiProperty({
    type: String,
    example: 'johndoe',
  })
  instagramUsername?: string | null;

  @ApiProperty({
    type: Number,
    example: 10000,
  })
  instagramFollowers?: number;

  @ApiProperty({
    type: Object,
    description: 'Detailed Instagram analytics data',
  })
  instagramData?: Record<string, any>;

  @ApiProperty({
    type: Number,
    example: 15,
  })
  eventsAttended?: number;

  @ApiProperty({
    type: Number,
    example: 5000.0,
  })
  totalCompensationEarned?: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  totalDeliverablesCompleted?: number;

  @ApiProperty({
    type: Number,
    example: 25000.0,
  })
  estimatedMediaValue?: number;

  @ApiProperty({
    type: Number,
    example: 150,
  })
  waitlistPosition?: number | null;

  @ApiProperty({
    type: Date,
  })
  approvalDate?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  referredBy?: User | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
