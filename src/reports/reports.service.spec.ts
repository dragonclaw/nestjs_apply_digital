import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  const fakeProductsService: Partial<ProductsService> = {
    returnsAllProducts: jest.fn(),
    returnsAllDeletedProducts: jest.fn(),
  };
  const mockRepository = () => {};
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: ProductsService, useValue: fakeProductsService },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
