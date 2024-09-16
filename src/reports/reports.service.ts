import { Injectable } from '@nestjs/common';
import { ReportDateRangeDto } from './dto/report-date-range.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReportsService {
  constructor(private productsService: ProductsService) {}

  //REFACTOR TO USE QUERYBUILDER INSTEAD OF ES6 Functional Programming
  async deletedProductsByPercentage() {
    const deletedProducts =
      await this.productsService.returnsAllDeletedProducts();
    const availableProducts = await this.productsService.returnsAllProducts();
    const deletedProductsPercentage =
      (deletedProducts.length / availableProducts.length) * 100;
    return { deletedProductsPercentage };
  }

  async productsPercentageWithPrice() {
    const availableProducts = await this.productsService.returnsAllProducts();
    const productsWithPrice = availableProducts.filter(
      (product) => product.product_price,
    );
    const productsWithPricePercentage =
      (productsWithPrice.length / availableProducts.length) * 100;
    return { productsWithPricePercentage };
  }

  async productsPercentageWithoutPrice() {
    const availableProducts = await this.productsService.returnsAllProducts();
    const productsWithPrice = availableProducts.filter(
      (product) => !product.product_price,
    );
    const productsWithoutPricePercentage =
      (productsWithPrice.length / availableProducts.length) * 100;
    return { productsWithoutPricePercentage };
  }

  productsWithDateRange(reportDateRangeDto: ReportDateRangeDto) {
    const { dateFrom, dateTo } = reportDateRangeDto;
    return `This action updates a report from ${dateFrom} to ${dateTo}`;
  }

  productsWithDifferentCategories() {
    return `This action removes a report`;
  }
}
