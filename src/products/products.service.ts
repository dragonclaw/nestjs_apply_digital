import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { DeletedProduct } from './entities/deleted_product.entity';

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
  ) {}

  @Cron('* * 1 * * *')
  async fetchProductsContentful() {
    console.log('Fetching products from Contentful every 1 hour');
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          'https://cdn.contentful.com/spaces/9xs1613l9f7v/environments/master/entries?access_token=I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns&content_type=product',
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    console.log('data', data);
    data.items.forEach(async (product: SingleProduct) => {
      const foundProduct = this.productRepository.findOne({
        where: { product_id: product.sys.id },
      });
      if (foundProduct) {
        console.log('Product already exists');
        return;
      }
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

  //TODO: Pagination here
  async findAll() {
    return this.productRepository.find();
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
