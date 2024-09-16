import { IsDateString } from 'class-validator';

export class ReportDateRangeDto {
  @IsDateString()
  readonly dateFrom: Date;

  @IsDateString()
  readonly dateTo: Date;
}
