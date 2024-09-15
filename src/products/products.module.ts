import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeletedProduct } from './entities/deleted_product.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Product, DeletedProduct])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
