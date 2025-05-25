import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUserService(user: CreateUserDTO): Promise<CreateUserDTO> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findListUserService(
    key: string,
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    if (!key) {
      key = '';
    }
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const whereClause = {
      username: ILike(`%${key}%`),
      email: ILike(`%${key}%`),
    };
    const [users, total] = await this.userRepository.findAndCount({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: users,
      total,
    };
  }

  async findOneUserService(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsernameUserService(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async updateUserService(
    id: number,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.findOneUserService(id);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async removeUserService(id: number): Promise<void> {
    const user = await this.findOneUserService(id);
    await this.userRepository.remove(user);
  }
}
