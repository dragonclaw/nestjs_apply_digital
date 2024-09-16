import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    console.log('email', email, 'password', password);
    const user = await this.usersService.find(email);
    console.log('this is the user', user);
    if (user.length) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: passwordHash });
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }
    const payload = { email: user.email, id: user.id };
    console.log(await this.jwtService.signAsync(payload));
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
