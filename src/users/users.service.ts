import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from './models/user';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private users: Array<User> = [];

  addUser(newUser: UserDto) {
    const userId = new Date().getTime().toString();

    this.users.push({ ...newUser, id: userId });

    return userId;
  }

  getAllUsers() {
    return this.users.slice();
  }

  getUserById(id: string) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { password: _, ...filtered } = user;
    return filtered;
  }
}
