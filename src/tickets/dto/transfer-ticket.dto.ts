import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TransferTicketDto {
  @ApiProperty({
    description: 'User ID to transfer the ticket to',
    example: 123,
  })
  @IsNumber()
  transferToUserId: number;
}
