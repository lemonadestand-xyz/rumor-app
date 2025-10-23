import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateEventCollaboratorDto {
  @ApiProperty({ example: 'uuid-event-id', description: 'Event ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiPropertyOptional({ example: 'uuid-user-id', description: 'User ID (optional if email provided)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Collaborator email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Collaborator name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'co-host', description: 'Collaborator role' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  role: string;
}

export class UpdateEventCollaboratorDto {
  @ApiPropertyOptional({ example: 'jane.doe@example.com', description: 'Updated email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Updated name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'assistant', description: 'Updated role' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;
}

export class EventCollaboratorResponseDto {
  @ApiProperty({ example: 'uuid-collaborator-id' })
  id: string;

  @ApiProperty({ example: 'uuid-event-id' })
  eventId: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  userId?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'co-host' })
  role: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}
