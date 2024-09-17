import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  const fakeProductsService: Partial<ProductsService> = {
    returnsAllProducts: jest.fn(() => {
      return Promise.resolve([
        {
          id: 8,
          product_id: '3ZxS5MCw4W3R8rcN1SdQB7',
          product_date: '2024-01-23T21:47:07.975Z',
          product_name: 'Dell Moto G7',
          product_price: 1829.92,
          product_sku: 'O53YSHQL',
          product_brand: 'Dell',
          product_model: 'Moto G7',
          product_category: 'Smartphone',
          product_color: 'Blue',
          product_currency: 'USD',
          product_stock: 75,
        },
        {
          id: 10,
          product_id: '6Nj5cWcuVoIPDJfZ72Lheb',
          product_date: '2024-01-23T21:47:07.862Z',
          product_name: 'Samsung iPhone 13',
          product_price: 1855.43,
          product_sku: 'UEBN4YX5',
          product_brand: 'Samsung',
          product_model: 'iPhone 13',
          product_category: 'Smartphone',
          product_color: 'Green',
          product_currency: 'USD',
          product_stock: 36,
        },
        {
          id: 17,
          product_id: '2AQxX92m191z9YpXa4E6fc',
          product_date: '2024-01-23T21:47:06.921Z',
          product_name: 'Sony Moto G7',
          product_price: 1786.34,
          product_sku: '266JZZZ8',
          product_brand: 'Sony',
          product_model: 'Moto G7',
          product_category: 'Smartphone',
          product_color: 'White',
          product_currency: 'USD',
          product_stock: 132,
        },
        {
          id: 19,
          product_id: '2AQxX92m191z9YpXa4E6fc',
          product_date: '2024-01-23T21:47:06.921Z',
          product_name: 'Sony Moto G7',
          product_price: 1786.34,
          product_sku: '266JZZZ8',
          product_brand: 'Sony',
          product_model: 'Moto G7',
          product_category: 'Smartphone',
          product_color: 'White',
          product_currency: 'USD',
          product_stock: 132,
        },
      ]);
    }),
    returnsAllDeletedProducts: jest.fn(() => {
      return Promise.resolve([
        {
          id: 1,
          product_id: '4HZHurmc8Ld78PNnI1ReYh',
        },
        {
          id: 2,
          product_id: 'mEr7EtjjiNSnFtULAEJMo',
        },
      ]);
    }),
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

  it('get report of deleted products percentage', async () => {
    expect(await service.deletedProductsByPercentage()).toEqual({
      deletedProductsPercentage: 50,
    });
  });

  it('get report of available products with price', async () => {
    expect(await service.productsPercentageWithPrice()).toEqual({
      productsWithPricePercentage: 100,
    });
  });

  it('get report of available products without price', async () => {
    expect(await service.productsPercentageWithoutPrice()).toEqual({
      productsWithoutPricePercentage: 0,
    });
  });
});
