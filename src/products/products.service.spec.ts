import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { HttpService } from '@nestjs/axios';

describe('ProductsService', () => {
  let service: ProductsService;
  const fakeHttpService: Partial<HttpService> = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: HttpService, useValue: fakeHttpService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
