import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 10, description: 'Items per page' })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, default: 0, description: 'Items to skip' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
