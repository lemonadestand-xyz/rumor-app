import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { CreateEventCollaboratorDto } from 'src/event-collaborators/dto/event-collaborator.dto';
import { CreateEventTagDto, BulkEventTagsCreateRequestDto } from 'src/event-tags/dto/event-tag-create-request.dto';
import { CreateEventSeriesDto } from 'src/event-series/dto/event-series.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Summer Music Concert', description: 'Event name' })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiPropertyOptional({ example: 'uuid-series-id', description: 'Event series ID' })
  @IsOptional()
  @IsUUID()
  seriesId?: string;

  @ApiPropertyOptional({ 
    description: 'Event collaborators',
    type: [CreateEventCollaboratorDto]
  })
  @ValidateNested({ each: true })
  @Type(() => CreateEventCollaboratorDto)
  collaborators?: CreateEventCollaboratorDto[];

  @ApiPropertyOptional({ 
    description: 'Event tags',
    type: [CreateEventTagDto]
  })
  @ValidateNested({ each: true })
  @Type(() => CreateEventTagDto)
  tags?: CreateEventTagDto[];

  @ApiPropertyOptional({ 
    description: 'Bulk create tags for the event',
    type: BulkEventTagsCreateRequestDto
  })
  @ValidateNested()
  @Type(() => BulkEventTagsCreateRequestDto)
  bulkTags?: BulkEventTagsCreateRequestDto;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Updated Summer Music Concert', description: 'Updated event name' })
  eventName?: string;

  @ApiPropertyOptional({ example: 'uuid-series-id', description: 'Updated event series ID' })
  seriesId?: string;

  @ApiPropertyOptional({ 
    description: 'Updated event collaborators',
    type: [CreateEventCollaboratorDto]
  })
  @ValidateNested({ each: true })
  @Type(() => CreateEventCollaboratorDto)
  collaborators?: CreateEventCollaboratorDto[];

  @ApiPropertyOptional({ 
    description: 'Updated event tags',
    type: [CreateEventTagDto]
  })
  @ValidateNested({ each: true })
  @Type(() => CreateEventTagDto)
  tags?: CreateEventTagDto[];

  @ApiPropertyOptional({ 
    description: 'Bulk update tags for the event',
    type: BulkEventTagsCreateRequestDto
  })
  @ValidateNested()
  @Type(() => BulkEventTagsCreateRequestDto)
  bulkTags?: BulkEventTagsCreateRequestDto;
}
