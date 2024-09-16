import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  const fakeAuthService: Partial<AuthService> = { signIn: jest.fn() };
  const fakeJwtService: Partial<JwtService> = { verifyAsync: jest.fn() };
  const fakeConfigService: Partial<ConfigService> = { get: jest.fn() };
  const fakeProductsService: Partial<ProductsService> = {
    returnsAllProducts: jest.fn(),
    returnsAllDeletedProducts: jest.fn(),
  };
  const mockRepository = () => {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        {
          module: class FakeModule {},
          providers: [
            { provide: AuthService, useValue: fakeAuthService },
            { provide: ProductsService, useValue: fakeProductsService },
            { provide: JwtService, useValue: fakeJwtService },
            { provide: ConfigService, useValue: fakeConfigService },
            {
              provide: getRepositoryToken(Product),
              useFactory: mockRepository,
            },
          ],
          exports: [AuthService, JwtService, ConfigService],
        },
      ],
      controllers: [ReportsController],
      providers: [
        ReportsService,
        { provide: ProductsService, useValue: fakeProductsService },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
