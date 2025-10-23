import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateEventSeriesDto {
  @ApiProperty({ example: 'Summer Music Festival', description: 'Series name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  seriesName: string;

  @ApiPropertyOptional({ 
    example: 'A series of summer music events', 
    description: 'Series description' 
  })
  @IsOptional()
  @IsString()
  seriesDescription?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/series/summer-festival', 
    description: 'Event series page URL' 
  })
  @IsOptional()
  @IsUrl()
  eventSeriesPage?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/artwork/series-banner.jpg', 
    description: 'Artwork URL' 
  })
  @IsOptional()
  @IsUrl()
  artworkUrl?: string;

  @ApiProperty({ example: 'uuid-user-id', description: 'Creator user ID' })
  @IsUUID()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateEventSeriesDto {
  @ApiPropertyOptional({ example: 'Summer Music Festival 2024', description: 'Updated series name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seriesName?: string;

  @ApiPropertyOptional({ 
    example: 'Updated series description', 
    description: 'Updated series description' 
  })
  @IsOptional()
  @IsString()
  seriesDescription?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/series/summer-festival-2024', 
    description: 'Updated event series page URL' 
  })
  @IsOptional()
  @IsUrl()
  eventSeriesPage?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/artwork/new-series-banner.jpg', 
    description: 'Updated artwork URL' 
  })
  @IsOptional()
  @IsUrl()
  artworkUrl?: string;

  @ApiPropertyOptional({ example: 'uuid-user-id', description: 'Updated by user ID' })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}

export class EventSeriesResponseDto {
  @ApiProperty({ example: 'uuid-series-id' })
  id: string;

  @ApiProperty({ example: 'Summer Music Festival' })
  seriesName: string;

  @ApiPropertyOptional({ example: 'A series of summer music events' })
  seriesDescription?: string;

  @ApiPropertyOptional({ example: 'https://example.com/series/summer-festival' })
  eventSeriesPage?: string;

  @ApiPropertyOptional({ example: 'https://example.com/artwork/series-banner.jpg' })
  artworkUrl?: string;

  @ApiProperty({ example: 'uuid-user-id' })
  createdBy: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  updatedBy?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: '2024-01-15T10:30:00Z' })
  deletedAt?: Date;
}
