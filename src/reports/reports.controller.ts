import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { ReportDateRangeDto } from './dto/report-date-range.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Get('listDeletedProductsByPercentage')
  listDeletedProductsByPercentage() {
    return this.reportsService.deletedProductsByPercentage();
  }

  @UseGuards(AuthGuard)
  @Get('listProductsWithPrice')
  listProductsPercentageWithPrice() {
    return this.reportsService.productsPercentageWithPrice();
  }

  @UseGuards(AuthGuard)
  @Get('listProductsWithoutPrice')
  listProductsWithoutPrice() {
    return this.reportsService.productsPercentageWithoutPrice();
  }

  @UseGuards(AuthGuard)
  @Get('listProductsWithDateRange')
  listProductsWithDateRange(@Query() reportDateRangeDto: ReportDateRangeDto) {
    return this.reportsService.productsWithDateRange(reportDateRangeDto);
  }

  @UseGuards(AuthGuard)
  @Get('listProductsWithDifferentCategories')
  listProductsWithDifferentCategories() {
    return this.reportsService.productsWithDifferentCategories();
  }
}
