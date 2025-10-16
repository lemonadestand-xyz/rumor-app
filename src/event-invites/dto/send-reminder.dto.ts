import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendReminderDto {
  @ApiPropertyOptional({
    description: 'Custom reminder message',
    example: 'Just a friendly reminder about the upcoming event!',
  })
  @IsString()
  @IsOptional()
  reminderMessage?: string;
}
