import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Product } from './entities/product.entity';
import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { DeletedProduct } from './entities/deleted_product.entity';
import { PageOptionsDto } from './dto/page-options.dto';
import { ConfigService } from '@nestjs/config';

interface SingleProduct {
  metadata: object;
  sys: {
    space: object;
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: object;
    revision: number;
    contentType: object;
    locale: string;
  };
  fields: {
    sku: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    color: string;
    price: number;
    currency: string;
    stock: number;
  };
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(DeletedProduct)
    private deletedProductRepository: Repository<DeletedProduct>,
    private configService: ConfigService,
  ) {}

  @Cron('* * 1 * * *')
  async fetchProductsContentful() {
    console.log('Fetching products from Contentful every 1 hour');
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `spaces/${this.configService.get('CONTENTFUL_SPACE_ID')}/environments/${this.configService.get('CONTENTFUL_ENVIRONMENT')}/entries`,
          {
            params: {
              access_token: this.configService.get('CONTENTFUL_ACCESS'),
              content_type: this.configService.get('CONTENTFUL_CONTENT_TYPE'),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    data.items.forEach(async (product: SingleProduct) => {
      const foundProduct = await this.productRepository.findOne({
        where: { product_id: product.sys.id },
      });
      const foundDeletedProduct = await this.deletedProductRepository.findOne({
        where: { product_id: product.sys.id },
      });
      if (foundProduct || foundDeletedProduct) {
        console.log('Product exists or was deleted');
        return;
      }
      console.log('Creating product');
      const createdProduct = await this.productRepository.create({
        product_id: product.sys.id,
        product_date: product.sys.createdAt,
        product_name: product.fields.name,
        product_price: product.fields.price,
        product_sku: product.fields.sku,
        product_brand: product.fields.brand,
        product_model: product.fields.model,
        product_category: product.fields.category,
        product_color: product.fields.color,
        product_currency: product.fields.currency,
        product_stock: product.fields.stock,
      });
      await this.productRepository.save(createdProduct);
    });

    return `${JSON.stringify({ success: true })}`;
  }

  create(createProductDto: CreateProductDto) {
    console.log('createProductDto', createProductDto);
    return 'This action adds a new product';
  }

  async findAll(PageOptionsDto: PageOptionsDto) {
    const {
      page,
      limit,
      priceMax,
      priceMin,
      filterByBrand,
      filterByCategory,
      filterByName,
    } = PageOptionsDto;

    const offset = (page - 1) * limit;
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        ...(filterByBrand && { product_brand: Like(`%${filterByBrand}%`) }),
        ...(filterByCategory && {
          product_category: Like(`%${filterByCategory}%`),
        }),
        ...(filterByName && { product_name: Like(`%${filterByName}%`) }),
        ...(priceMin && {
          product_price: MoreThan(priceMin),
        }),
        ...(priceMax && {
          product_price: LessThan(priceMax),
        }),
      },
      skip: offset,
      take: limit,
    });
    return { products, total, page, limit };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const deleted_item = await this.productRepository.findOne({
      where: { id },
    });
    if (!deleted_item) {
      throw new NotFoundException('Product not found');
    }
    const created_on_deleted_product =
      await this.deletedProductRepository.create({
        product_id: deleted_item.product_id,
      });
    await this.deletedProductRepository.save(created_on_deleted_product);
    await this.productRepository.remove(deleted_item);
    return deleted_item;
  }
}
