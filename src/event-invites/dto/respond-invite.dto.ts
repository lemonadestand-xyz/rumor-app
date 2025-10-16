import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InviteStatus } from '../domain/event-invite';

export class RespondInviteDto {
  @ApiProperty({
    enum: [InviteStatus.ACCEPTED, InviteStatus.DECLINED],
    description: 'Response to the invitation',
    example: InviteStatus.ACCEPTED,
  })
  @IsEnum([InviteStatus.ACCEPTED, InviteStatus.DECLINED])
  response: InviteStatus.ACCEPTED | InviteStatus.DECLINED;

  @ApiPropertyOptional({
    description: 'Optional response message',
    example: 'Looking forward to the event!',
  })
  @IsString()
  @IsOptional()
  responseMessage?: string;
}
