import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeletedProduct } from './entities/deleted_product.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('ProductsService', () => {
  const mockProductsDatabase = [
    {
      id: 3,
      product_id: 'sSQ4LpSwDIZ4iOLuyvv25',
      product_date: '2024-01-23T21:47:07.090Z',
      product_name: 'Dell ThinkPad X1',
      product_sku: 'PT06KQ57',
      product_brand: 'Dell',
      product_model: 'ThinkPad X1',
      product_category: 'Laptop',
      product_color: 'Purple',
      product_stock: 148,
      product_price: '457.73',
      product_currency: 'USD',
    },
    {
      id: 4,
      product_id: 'FR1giCYgMWKPt0n9AeGeo',
      product_date: '2024-01-23T21:47:07.057Z',
      product_name: 'HP Watch Series 7',
      product_sku: 'WGO6N8GK',
      product_brand: 'HP',
      product_model: 'Watch Series 7',
      product_category: 'Smartwatch',
      product_color: 'Blue',
      product_stock: 199,
      product_price: '1887.38',
      product_currency: 'USD',
    },
  ];

  const mockDeletedProductsDatabase = [
    {
      id: 1,
      product_id: '4HZHurmc8Ld78PNnI1ReYh',
    },
    {
      id: 2,
      product_id: 'mEr7EtjjiNSnFtULAEJMo',
    },
  ];

  let productsService: ProductsService;
  let productRepository: ReturnType<typeof mockRepository>;
  let deletedProductRepository: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: HttpService, useValue: {} },
        { provide: ConfigService, useValue: {} },
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

    productsService = module.get<ProductsService>(ProductsService);
    productRepository = module.get(getRepositoryToken(Product));
    deletedProductRepository = module.get(getRepositoryToken(DeletedProduct));
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should return all products', async () => {
    productRepository.find.mockResolvedValue(mockProductsDatabase);
    const products = await productsService.returnsAllProducts();
    expect(products).toEqual(mockProductsDatabase);
  });

  it('should return all deleted products', async () => {
    deletedProductRepository.find.mockResolvedValue(
      mockDeletedProductsDatabase,
    );
    const products = await productsService.returnsAllDeletedProducts();
    expect(products).toEqual(mockDeletedProductsDatabase);
  });

  it('should return a single product', async () => {
    productRepository.findOne.mockResolvedValue(mockProductsDatabase[0]);
    const products = await productsService.findOne(3);
    expect(products).toEqual(mockProductsDatabase[0]);
  });
});
