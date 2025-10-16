import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryHostProfileDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => String)
  filters?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => String)
  sort?: string | null;
}
