import { Injectable } from '@nestjs/common';
import { ReportDateRangeDto } from './dto/report-date-range.dto';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    private productsService: ProductsService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

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

  async productsWithDateRange(reportDateRangeDto: ReportDateRangeDto) {
    const { dateFrom, dateTo } = reportDateRangeDto;
    const products = await this.productsRepository
      .createQueryBuilder('products')
      .select('*')
      .where('products.product_date BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      })
      .getRawMany();
    return products;
  }

  productsAndQuantityWithDifferentCategories() {
    const distinctCategories = this.productsRepository
      .createQueryBuilder('products')
      .select('DISTINCT products.product_category as category')
      .addSelect('COUNT(products.product_category) as quantity')
      .groupBy('products.product_category')
      .getRawMany();
    return distinctCategories;
  }
}
