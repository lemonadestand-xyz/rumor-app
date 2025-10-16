import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RSVPStatus } from '../domain/guest';

export class UpdateRsvpDto {
  @ApiProperty({ enum: RSVPStatus, example: RSVPStatus.ACCEPTED })
  @IsEnum(RSVPStatus)
  status: RSVPStatus;
}
