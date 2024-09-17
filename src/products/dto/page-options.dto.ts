import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(5)
  @Max(100)
  readonly limit?: number = 5;

  @Type(() => String)
  @IsOptional()
  readonly filterByCategory?: string;

  @Type(() => String)
  @IsOptional()
  readonly filterByBrand?: string;

  @Type(() => String)
  @IsOptional()
  readonly filterByName?: string;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  readonly priceMin?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  readonly priceMax?: number;
}
