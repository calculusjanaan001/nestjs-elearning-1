import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  private readonly DUPLICATE_KEY_CODE = 11000;

  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
  ) {}

  async addUser(newUser: CreateUserDto) {
    try {
      const addedUser = await this.usersRepo.save(newUser);

      return addedUser.id;
    } catch (error) {
      /** Duplicate key error code */
      if (error.code === this.DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email already exists.');
      }

      throw new InternalServerErrorException('Error in saving user.');
    }
  }

  getAllUsers() {
    try {
      return this.usersRepo.find({
        select: ['id', 'email', 'role', 'firstName', 'lastName'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error in getting all user.');
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepo.findOne(id, {
        select: ['id', 'email', 'role', 'firstName', 'lastName'],
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting user.');
    }
  }
}
