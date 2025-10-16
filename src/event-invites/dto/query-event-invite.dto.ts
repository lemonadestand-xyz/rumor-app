import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { InviteStatus, InviteType } from '../domain/event-invite';

export class FilterEventInviteDto {
  @ApiPropertyOptional({
    enum: InviteStatus,
    isArray: true,
    description: 'Filter by invitation statuses',
  })
  @IsOptional()
  @IsEnum(InviteStatus, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  statuses?: InviteStatus[];

  @ApiPropertyOptional({
    enum: InviteType,
    isArray: true,
    description: 'Filter by invitation types',
  })
  @IsOptional()
  @IsEnum(InviteType, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  inviteTypes?: InviteType[];

  @ApiPropertyOptional({
    description: 'Filter by event ID',
  })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user who sent the invitation',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  invitedById?: number;

  @ApiPropertyOptional({
    description: 'Filter by invited user ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  invitedUserId?: number;

  @ApiPropertyOptional({
    description: 'Filter by invitee email',
  })
  @IsOptional()
  @IsEmail()
  inviteeEmail?: string;

  @ApiPropertyOptional({
    description: 'Filter by VIP status',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isVIP?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by plus one allowed',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  allowPlusOne?: boolean;
}

export class SortEventInviteDto {
  @ApiPropertyOptional({
    enum: [
      'id',
      'status',
      'inviteType',
      'inviteCode',
      'sentAt',
      'viewedAt',
      'respondedAt',
      'expiresAt',
      'remindersSent',
      'isVIP',
      'createdAt',
      'updatedAt',
    ],
  })
  @IsEnum([
    'id',
    'status',
    'inviteType',
    'inviteCode',
    'sentAt',
    'viewedAt',
    'respondedAt',
    'expiresAt',
    'remindersSent',
    'isVIP',
    'createdAt',
    'updatedAt',
  ])
  orderBy: keyof {
    id: string;
    status: InviteStatus;
    inviteType: InviteType;
    inviteCode: string;
    sentAt: Date;
    viewedAt: Date;
    respondedAt: Date;
    expiresAt: Date;
    remindersSent: number;
    isVIP: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}

export class QueryEventInviteDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Filters',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(FilterEventInviteDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested()
  @Type(() => FilterEventInviteDto)
  filters?: FilterEventInviteDto | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortEventInviteDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortEventInviteDto)
  sort?: SortEventInviteDto[] | null;
}
