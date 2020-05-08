import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Post()
  registerUser(@Body() userBody: CreateUserDto) {
    return this.usersService.addUser(userBody);
  }
}
