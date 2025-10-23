import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateEventTagDto {
  @ApiProperty({ example: 'uuid-event-id', description: 'Event ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ example: 'music', description: 'Tag name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tagName: string;
}

// export class UpdateEventTagDto {
//   @ApiPropertyOptional({ example: 'concert', description: 'Updated tag name' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(100)
//   tagName?: string;
// }

// export class EventTagResponseDto {
//   @ApiProperty({ example: 'uuid-tag-id' })
//   id: string;

//   @ApiProperty({ example: 'uuid-event-id' })
//   eventId: string;

//   @ApiProperty({ example: 'music' })
//   tagName: string;

//   @ApiProperty({ example: '2024-01-15T10:30:00Z' })
//   createdAt: Date;
// }

export class BulkEventTagsCreateRequestDto {
  @ApiProperty({ example: 'uuid-event-id', description: 'Event ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ 
    example: ['music', 'concert', 'live'], 
    description: 'Array of tag names',
    type: [String]
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  tagNames: string[];
}
