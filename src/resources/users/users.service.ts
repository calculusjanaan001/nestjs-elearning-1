import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UsersService {
  private readonly DUPLICATE_KEY_CODE = 11000;
  private readonly USER_PROJECTION = '-password';

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const insertedUser = await createdUser.save();
      delete insertedUser.password;
      return insertedUser;
    } catch (error) {
      /** Duplicate key error code */
      if (error.code === this.DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException('Error in saving user.');
    }
  }

  getAllUsers(): Promise<User[]> {
    try {
      return this.userModel.find({}, this.USER_PROJECTION).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting all user.');
    }
  }

  getUserById(id: string): Promise<User> {
    try {
      return this.userModel.findById(id, this.USER_PROJECTION).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting user.');
    }
  }
}
