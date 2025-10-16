import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  IsObject,
} from 'class-validator';
import { PersonalityType } from '../domain/member-profile';

export class CreateMemberProfileDto {
  @ApiProperty({
    example:
      'I am a creative professional who loves networking at exclusive events.',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'New York, NY', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Marketing Manager', required: false })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({
    example: ['Music', 'Fashion', 'Tech', 'Art'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({
    enum: PersonalityType,
    example: PersonalityType.ARCHITECT,
    required: false,
  })
  @IsEnum(PersonalityType)
  @IsOptional()
  personalityType?: PersonalityType;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  instagramUsername?: string;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  instagramFollowers?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  instagramData?: Record<string, any>;
}
