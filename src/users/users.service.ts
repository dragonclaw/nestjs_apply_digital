import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const user = this.usersRepository.create({ email, password });
      return this.usersRepository.save(user);
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  findAll() {
    const users = this.usersRepository.find();
    if (!users) throw new NotFoundException('No users found');
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByEmail(email: string) {
    const user = this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.email = updateUserDto.email;
    user.password = await bcrypt.hash(updateUserDto.password, 10);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user: User = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.usersRepository.remove(user);
  }
}
