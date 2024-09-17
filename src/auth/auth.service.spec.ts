import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('AuthService', () => {
  let fakeJwtService: Partial<JwtService>;
  let fakeUsersService: Partial<UsersService>;
  let authService: AuthService;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers[0]);
      },
      create: (createUserDto: CreateUserDto) => {
        const { email, password } = createUserDto;
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    fakeJwtService = {
      signAsync: () => Promise.resolve('token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: fakeJwtService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('can sign up a user with hash password', async () => {
    const user = await authService.signUp('new_email@email.com', 'password');
    expect(user.password).not.toEqual('password');
  });

  it('throws error if signup with email used', async () => {
    await authService.signUp('new_email@email.com', 'password');
    await expect(
      authService.signUp('new_email@email.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('can sign in a user and receive a jwt', async () => {
    await authService.signUp('good_email@email.com', 'password');
    const user = await authService.signIn('good_email@email.com', 'password');
    expect(user.accessToken).toBeDefined();
  });

  it('throws error if sign in a user with wrong password', async () => {
    await authService.signUp('good_email@email.com', 'password');
    await expect(
      authService.signIn('good_email@email.com', 'badPassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws error if signin with email unused', async () => {
    await expect(
      authService.signIn('not_found_email@email.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });
});
