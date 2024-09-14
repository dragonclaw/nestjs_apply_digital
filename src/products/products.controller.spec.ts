import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpService } from '@nestjs/axios';

describe('ProductsController', () => {
  let controller: ProductsController;
  const fakeHttpService: Partial<HttpService> = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: HttpService, useValue: fakeHttpService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
