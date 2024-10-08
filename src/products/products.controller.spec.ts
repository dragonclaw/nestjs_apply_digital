import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeletedProduct } from './entities/deleted_product.entity';
import { ConfigService } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;
  const fakeHttpService: Partial<HttpService> = { get: jest.fn() };
  const fakeConfigService: Partial<ConfigService> = { get: jest.fn() };
  const mockRepository = () => {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: HttpService, useValue: fakeHttpService },
        { provide: ConfigService, useValue: fakeConfigService },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(DeletedProduct),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
