import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';

import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
