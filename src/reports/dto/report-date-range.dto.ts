import { IsDate } from 'class-validator';

export class ReportDateRangeDto {
  @IsDate()
  readonly dateFrom: Date;

  @IsDate()
  readonly dateTo: Date;
}
