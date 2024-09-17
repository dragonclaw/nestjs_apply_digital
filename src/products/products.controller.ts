import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PageOptionsDto } from './dto/page-options.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() PageOptionsDto: PageOptionsDto) {
    return this.productsService.findAll(PageOptionsDto);
  }

  @Get('deletedProducts')
  findAllDeletedProducts() {
    return this.productsService.returnsAllDeletedProducts();
  }

  @Get('fetch')
  fetchProducts() {
    return this.productsService.fetchProductsContentful();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
