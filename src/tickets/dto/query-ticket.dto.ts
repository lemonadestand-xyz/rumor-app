import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { TicketStatus, TicketType } from '../domain/ticket';

export class FilterTicketDto {
  @ApiPropertyOptional({
    enum: TicketStatus,
    isArray: true,
    description: 'Filter by ticket statuses',
  })
  @IsOptional()
  @IsEnum(TicketStatus, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  statuses?: TicketStatus[];

  @ApiPropertyOptional({
    enum: TicketType,
    isArray: true,
    description: 'Filter by ticket types',
  })
  @IsOptional()
  @IsEnum(TicketType, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  ticketTypes?: TicketType[];

  @ApiPropertyOptional({
    description: 'Filter by event ID',
  })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Filter by owner user ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ownerId?: number;

  @ApiPropertyOptional({
    description: 'Filter by purchaser user ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  purchasedById?: number;

  @ApiPropertyOptional({
    description: 'Filter by used status',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isUsed?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by refunded status',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isRefunded?: boolean;
}

export class SortTicketDto {
  @ApiPropertyOptional({
    enum: [
      'id',
      'ticketNumber',
      'ticketType',
      'status',
      'price',
      'paidPrice',
      'purchasedAt',
      'validFrom',
      'validUntil',
      'createdAt',
      'updatedAt',
    ],
  })
  @IsEnum([
    'id',
    'ticketNumber',
    'ticketType',
    'status',
    'price',
    'paidPrice',
    'purchasedAt',
    'validFrom',
    'validUntil',
    'createdAt',
    'updatedAt',
  ])
  orderBy: keyof {
    id: string;
    ticketNumber: string;
    ticketType: TicketType;
    status: TicketStatus;
    price: number;
    paidPrice: number;
    purchasedAt: Date;
    validFrom: Date;
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}

export class QueryTicketDto {
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
      ? plainToInstance(FilterTicketDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested()
  @Type(() => FilterTicketDto)
  filters?: FilterTicketDto | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Sorting',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortTicketDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortTicketDto)
  sort?: SortTicketDto[] | null;
}
