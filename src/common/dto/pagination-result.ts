import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationOptions {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  size?: number;
}

export class PaginationResult<T> {
  pagination: PaginationOptions & { total?: number } = {};
  data: T[];

  constructor(
    rawData: T[],
    totalItems: number,
    paginationOptions: PaginationOptions,
  ) {
    this.pagination.page = paginationOptions.page || 0;
    this.pagination.size = paginationOptions.size || 10;
    this.pagination.total = totalItems;
    this.data = rawData;
  }
}
