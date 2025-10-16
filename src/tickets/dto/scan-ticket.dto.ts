import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ScanTicketDto {
  @ApiProperty({
    description: 'Ticket number or QR code to scan',
    example: 'TKT-ABC123',
  })
  @IsString()
  ticketIdentifier: string;

  @ApiPropertyOptional({
    description: 'Notes about the scan',
    example: 'Late arrival',
  })
  @IsString()
  @IsOptional()
  scanNotes?: string;
}
