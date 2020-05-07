import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
  ) {}

  async addUser(newUser: CreateUserDto) {
    try {
      const addedUser = await this.usersRepo.save(newUser);

      return addedUser.id;
    } catch (error) {
      console.log('ERRPOR');
      console.log(error);
      throw new HttpException(
        'Error in saving user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAllUsers() {
    try {
      return this.usersRepo.find();
    } catch (error) {
      throw new HttpException(
        'Error in getting all user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepo.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const { password: _, ...filtered } = user;

      return filtered;
    } catch (error) {
      throw new HttpException(
        'Error in getting user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
