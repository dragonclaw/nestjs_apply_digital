import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ReportsController', () => {
  let controller: ReportsController;
  const fakeAuthService: Partial<AuthService> = { signIn: jest.fn() };
  const fakeJwtService: Partial<JwtService> = { verifyAsync: jest.fn() };
  const fakeConfigService: Partial<ConfigService> = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        {
          module: class FakeModule {},
          providers: [
            { provide: AuthService, useValue: fakeAuthService },
            { provide: JwtService, useValue: fakeJwtService },
            { provide: ConfigService, useValue: fakeConfigService },
          ],
          exports: [AuthService, JwtService, ConfigService],
        },
      ],
      controllers: [ReportsController],
      providers: [ReportsService],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
