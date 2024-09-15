import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { HttpService } from '@nestjs/axios';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  const fakeHttpService: Partial<HttpService> = { get: jest.fn() };
  const mockRepository = () => {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: HttpService, useValue: fakeHttpService },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
