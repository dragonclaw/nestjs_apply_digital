import { Injectable, ServiceUnavailableException } from '@nestjs/common';
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
    try {
      const deletedProducts =
        await this.productsService.returnsAllDeletedProducts();
      const availableProducts = await this.productsService.returnsAllProducts();
      const deletedProductsPercentage =
        (deletedProducts.length / availableProducts.length) * 100;
      return { deletedProductsPercentage };
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async productsPercentageWithPrice() {
    try {
      const availableProducts = await this.productsService.returnsAllProducts();
      const productsWithPrice = availableProducts.filter(
        (product) => product.product_price,
      );
      const productsWithPricePercentage =
        (productsWithPrice.length / availableProducts.length) * 100;
      return { productsWithPricePercentage };
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async productsPercentageWithoutPrice() {
    try {
      const availableProducts = await this.productsService.returnsAllProducts();
      const productsWithPrice = availableProducts.filter(
        (product) => !product.product_price,
      );
      const productsWithoutPricePercentage =
        (productsWithPrice.length / availableProducts.length) * 100;
      return { productsWithoutPricePercentage };
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async productsWithDateRange(reportDateRangeDto: ReportDateRangeDto) {
    try {
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
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  productsAndQuantityWithDifferentCategories() {
    try {
      const distinctCategories = this.productsRepository
        .createQueryBuilder('products')
        .select('DISTINCT products.product_category as category')
        .addSelect('COUNT(products.product_category) as quantity')
        .groupBy('products.product_category')
        .getRawMany();
      return distinctCategories;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }
}
